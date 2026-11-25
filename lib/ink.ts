"use client";
/* eslint-disable react-hooks/rules-of-hooks -- gl.useProgram is WebGL, not a React hook */

/*
  Ink in water, in plain WebGL.
  Ink lives in a float texture. Every step carries it along a slow curl-noise current,
  adds whatever the cursor stirred in (or a drop that fell), blurs it a touch and lets
  it fade. A second pass paints it as ink clouding into milk the colour of the page.
*/

const NOISE =
  "float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}" +
  "float noise(vec2 x){vec2 i=floor(x),f=fract(x);f=f*f*(3.0-2.0*f);" +
  "return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);}";

const VS = "attribute vec2 aPos;void main(){gl_Position=vec4(aPos,0.0,1.0);}";

const ADVECT = `precision highp float;
uniform sampler2D uPrev;uniform vec2 uRes;uniform float uTime;uniform float uAspect;uniform float uDecay;
uniform vec4 uMouse;uniform vec2 uMouseVel;uniform vec4 uDrops[4];uniform vec4 uDropVel[4];uniform float uFlow;
${NOISE}
float field(vec2 p){return noise(p*1.7+vec2(0.0,uTime*0.06))+0.5*noise(p*3.4-vec2(uTime*0.05,0.0));}
vec2 curl(vec2 p){float e=0.02;float a=field(p+vec2(0.0,e)),b=field(p-vec2(0.0,e));float c=field(p+vec2(e,0.0)),d=field(p-vec2(e,0.0));return vec2(a-b,-(c-d))/(2.0*e);}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;vec2 p=vec2(uv.x*uAspect,uv.y);
  vec2 vel=(curl(p*1.6)*0.0017+curl(p*4.2+7.0)*0.0005)*uFlow;float add=0.0;
  vec2 d=(uv-uMouse.xy)*vec2(uAspect,1.0);float f=exp(-dot(d,d)/(uMouse.w*uMouse.w));
  vel+=uMouseVel*f;add+=uMouse.z*f;
  for(int i=0;i<4;i++){vec4 dr=uDrops[i];if(dr.z<=0.0)continue;vec2 dd=(uv-dr.xy)*vec2(uAspect,1.0);float ff=exp(-dot(dd,dd)/(dr.w*dr.w));vel+=uDropVel[i].xy*ff;add+=dr.z*ff;}
  vec2 src=uv-vel;vec2 px=1.0/uRes;float c0=texture2D(uPrev,src).r;
  float blur=(texture2D(uPrev,src+vec2(px.x,0.0)).r+texture2D(uPrev,src-vec2(px.x,0.0)).r+texture2D(uPrev,src+vec2(0.0,px.y)).r+texture2D(uPrev,src-vec2(0.0,px.y)).r)*0.25;
  float ink=mix(c0,blur,0.012*uFlow);ink=ink*uDecay+add;
  gl_FragColor=vec4(clamp(ink,0.0,2.0),0.0,0.0,1.0);
}`;

const DISPLAY = `precision highp float;
uniform sampler2D uInk;uniform vec2 uRes;uniform vec3 uMilk;
${NOISE}
float den(vec2 t){return texture2D(uInk,t).r;}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;float d=den(uv);vec2 e=1.5/uRes;
  float gx=den(uv+vec2(e.x,0.0))-den(uv-vec2(e.x,0.0));
  float gy=den(uv+vec2(0.0,e.y))-den(uv-vec2(0.0,e.y));
  float edge=clamp(length(vec2(gx,gy))*6.0,0.0,1.0);
  vec3 milk=uMilk;
  milk-=0.025*smoothstep(0.35,1.0,length(uv-0.5)*1.3);
  milk+=(noise(uv*vec2(uRes.x/uRes.y,1.0)*300.0)-0.5)*0.012;
  vec3 thin=vec3(0.36,0.39,0.52);vec3 thick=vec3(0.05,0.05,0.08);
  float cover=1.0-exp(-d*2.3);vec3 ink=mix(thin,thick,smoothstep(0.15,0.9,d));
  vec3 col=mix(milk,ink,cover);col-=edge*0.08*(1.0-cover*0.6);
  gl_FragColor=vec4(col,1.0);
}`;

type Opts = { still: () => boolean; milk?: [number, number, number] };
export type InkPool = { dropAt: (x: number, y: number, amt: number) => void; destroy: () => void; motion: () => void };

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function makeInk(canvas: HTMLCanvasElement, host: HTMLElement, seeds: number[][], o: Opts): InkPool | null {
  const ctxOpts = { alpha: false, antialias: false, depth: false, stencil: false, premultipliedAlpha: false, preserveDrawingBuffer: false };
  let gl = canvas.getContext("webgl2", ctxOpts) as WebGL2RenderingContext | WebGLRenderingContext | null;
  const gl2 = !!gl;
  if (!gl) gl = canvas.getContext("webgl", ctxOpts) as WebGLRenderingContext | null;
  if (!gl) return null;
  const G = gl;

  const compile = (type: number, src: string) => {
    const s = G.createShader(type)!;
    G.shaderSource(s, src);
    G.compileShader(s);
    if (!G.getShaderParameter(s, G.COMPILE_STATUS)) {
      console.warn(G.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const program = (fs: string) => {
    const v = compile(G.VERTEX_SHADER, VS);
    const f = compile(G.FRAGMENT_SHADER, fs);
    if (!v || !f) return null;
    const p = G.createProgram()!;
    G.attachShader(p, v);
    G.attachShader(p, f);
    G.bindAttribLocation(p, 0, "aPos");
    G.linkProgram(p);
    if (!G.getProgramParameter(p, G.LINK_STATUS)) return null;
    const u: Record<string, WebGLUniformLocation | null> = {};
    const n = G.getProgramParameter(p, G.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) {
      const info = G.getActiveUniform(p, i)!;
      u[info.name.replace(/\[0\]$/, "")] = G.getUniformLocation(p, info.name);
    }
    return { p, u };
  };
  const advect = program(ADVECT);
  const display = program(DISPLAY);
  if (!advect || !display) return null;

  const buf = G.createBuffer();
  G.bindBuffer(G.ARRAY_BUFFER, buf);
  G.bufferData(G.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), G.STATIC_DRAW);
  G.enableVertexAttribArray(0);
  G.vertexAttribPointer(0, 2, G.FLOAT, false, 0, 0);

  type Fmt = { internal: number; format: number; type: number; decay: number };
  type Target = { tex: WebGLTexture; fb: WebGLFramebuffer; ok: boolean };
  const makeTarget = (w: number, h: number, f: Fmt): Target => {
    const tex = G.createTexture()!;
    G.bindTexture(G.TEXTURE_2D, tex);
    G.texParameteri(G.TEXTURE_2D, G.TEXTURE_MIN_FILTER, G.LINEAR);
    G.texParameteri(G.TEXTURE_2D, G.TEXTURE_MAG_FILTER, G.LINEAR);
    G.texParameteri(G.TEXTURE_2D, G.TEXTURE_WRAP_S, G.CLAMP_TO_EDGE);
    G.texParameteri(G.TEXTURE_2D, G.TEXTURE_WRAP_T, G.CLAMP_TO_EDGE);
    G.texImage2D(G.TEXTURE_2D, 0, f.internal, w, h, 0, f.format, f.type, null);
    const fb = G.createFramebuffer()!;
    G.bindFramebuffer(G.FRAMEBUFFER, fb);
    G.framebufferTexture2D(G.FRAMEBUFFER, G.COLOR_ATTACHMENT0, G.TEXTURE_2D, tex, 0);
    const ok = G.checkFramebufferStatus(G.FRAMEBUFFER) === G.FRAMEBUFFER_COMPLETE;
    G.clearColor(0, 0, 0, 1);
    G.clear(G.COLOR_BUFFER_BIT);
    G.bindFramebuffer(G.FRAMEBUFFER, null);
    return { tex, fb, ok };
  };

  // the best texture format this device can render into
  const formats: Fmt[] = [];
  if (gl2) {
    const g2 = G as WebGL2RenderingContext;
    if (g2.getExtension("EXT_color_buffer_float") || g2.getExtension("EXT_color_buffer_half_float"))
      formats.push({ internal: g2.RGBA16F, format: g2.RGBA, type: g2.HALF_FLOAT, decay: 0.9978 });
    formats.push({ internal: g2.RGBA8, format: g2.RGBA, type: g2.UNSIGNED_BYTE, decay: 0.975 });
  } else {
    const hf = G.getExtension("OES_texture_half_float");
    G.getExtension("OES_texture_half_float_linear");
    if (hf) formats.push({ internal: G.RGBA, format: G.RGBA, type: hf.HALF_FLOAT_OES, decay: 0.9978 });
    formats.push({ internal: G.RGBA, format: G.RGBA, type: G.UNSIGNED_BYTE, decay: 0.975 });
  }
  let fmt: Fmt | null = null;
  for (const f of formats) {
    const t = makeTarget(4, 4, f);
    G.deleteTexture(t.tex);
    G.deleteFramebuffer(t.fb);
    if (t.ok) {
      fmt = f;
      break;
    }
  }
  if (!fmt) return null;
  const F = fmt;

  const SIM = 0.55;
  let A: Target | null = null;
  let B: Target | null = null;
  let W = 0;
  let H = 0;
  let simW = 0;
  let simH = 0;
  const build = () => {
    const r = host.getBoundingClientRect();
    W = Math.max(2, Math.round(r.width));
    H = Math.max(2, Math.round(r.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    simW = Math.max(2, Math.floor(W * SIM));
    simH = Math.max(2, Math.floor(H * SIM));
    [A, B].forEach((t) => {
      if (t) {
        G.deleteTexture(t.tex);
        G.deleteFramebuffer(t.fb);
      }
    });
    A = makeTarget(simW, simH, F);
    B = makeTarget(simW, simH, F);
  };
  build();

  type Drop = { x: number; y: number; amt: number; vx: number; vy: number; life: number };
  let drops: Drop[] = [];
  const mouse = { x: -1, y: -1, px: -1, py: -1, inside: false, down: false };
  let lastTouch = -10;
  let nextDrop = 0;
  let simTime = 0;
  const drop = (x: number, y: number, amt: number, vx?: number, vy?: number) => {
    drops.push({ x, y, amt, vx: vx ?? rand(-0.004, 0.004), vy: vy ?? rand(-0.006, -0.002), life: 1 });
    if (drops.length > 4) drops.shift();
  };
  const DV = new Float32Array(16);
  const DVEL = new Float32Array(16);
  const milk = o.milk ?? [0.925, 0.922, 0.906];

  const step = (auto: boolean) => {
    simTime += 1 / 60;
    const t = simTime;
    if (auto && t > nextDrop) {
      nextDrop = t + rand(2.2, 3.6);
      if (t - lastTouch > 2.5) drop(rand(0.15, 0.85), rand(0.2, 0.8), rand(0.5, 0.9));
    }
    let mvx = 0;
    let mvy = 0;
    let amount = 0;
    const radius = mouse.down ? 0.035 : 0.016;
    if (mouse.inside && mouse.px >= 0) {
      mvx = (mouse.x - mouse.px) / W;
      mvy = -(mouse.y - mouse.py) / H;
      amount = mouse.down ? 0.09 : 0.035 * Math.min(1, Math.hypot(mvx, mvy) * 40);
    }
    mouse.px = mouse.x;
    mouse.py = mouse.y;
    for (let i = 0; i < 4; i++) {
      const d = drops[i];
      if (d) {
        d.life -= 0.02;
        d.x += d.vx * 0.4;
        d.y += d.vy * 0.4;
        DV.set([d.x, d.y, Math.max(0, d.life) * d.amt * 0.16, 0.018 + (1 - d.life) * 0.022], i * 4);
        DVEL.set([d.vx, d.vy, 0, 0], i * 4);
      } else {
        DV.set([0, 0, 0, 0.01], i * 4);
        DVEL.set([0, 0, 0, 0], i * 4);
      }
    }
    drops = drops.filter((d) => d.life > 0);

    G.bindFramebuffer(G.FRAMEBUFFER, B!.fb);
    G.viewport(0, 0, simW, simH);
    G.useProgram(advect.p);
    G.activeTexture(G.TEXTURE0);
    G.bindTexture(G.TEXTURE_2D, A!.tex);
    const u = advect.u;
    G.uniform1i(u.uPrev, 0);
    G.uniform2f(u.uRes, simW, simH);
    G.uniform1f(u.uTime, t);
    G.uniform1f(u.uAspect, W / H);
    G.uniform1f(u.uDecay, F.decay);
    G.uniform1f(u.uFlow, 1);
    G.uniform4f(u.uMouse, mouse.x / W, 1 - mouse.y / H, amount, radius);
    G.uniform2f(u.uMouseVel, clamp(mvx, -0.03, 0.03) * 0.8, clamp(mvy, -0.03, 0.03) * 0.8);
    G.uniform4fv(u.uDrops, DV);
    G.uniform4fv(u.uDropVel, DVEL);
    G.drawArrays(G.TRIANGLES, 0, 3);
    const s = A;
    A = B;
    B = s;
  };
  const draw = () => {
    G.bindFramebuffer(G.FRAMEBUFFER, null);
    G.viewport(0, 0, canvas.width, canvas.height);
    G.useProgram(display.p);
    G.activeTexture(G.TEXTURE0);
    G.bindTexture(G.TEXTURE_2D, A!.tex);
    G.uniform1i(display.u.uInk, 0);
    G.uniform2f(display.u.uRes, canvas.width, canvas.height);
    G.uniform3f(display.u.uMilk, milk[0], milk[1], milk[2]);
    G.drawArrays(G.TRIANGLES, 0, 3);
  };
  // with animations off: run the flow ahead to a settled frame and hold it
  const settle = (n: number) => {
    for (let i = 0; i < n; i++) step(false);
    draw();
  };

  let raf = 0;
  let last = 0;
  let acc = 0;
  let visible = false;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    acc += dt;
    let n = 0;
    while (acc >= 1 / 60 && n < 3) {
      step(true);
      acc -= 1 / 60;
      n++;
    }
    if (n) draw();
  };
  const start = () => {
    if (raf || o.still() || !visible || document.hidden) return;
    last = performance.now();
    acc = 0;
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  seeds.forEach((s) => drop(s[0], s[1], s[2], s[3], s[4]));
  settle(o.still() ? 160 : 20);

  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVis);
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) start();
    else stop();
  });
  io.observe(host);

  let lastW = W;
  let lastH = H;
  let rt: ReturnType<typeof setTimeout> | undefined;
  const onResize = () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      const r = host.getBoundingClientRect();
      if (Math.round(r.width) === lastW && Math.abs(r.height - lastH) < 140) return; // ignore mobile address bar jumps
      build();
      lastW = W;
      lastH = H;
      drop(0.5, 0.5, 0.9, 0, 0);
      settle(o.still() ? 120 : 10);
    }, 150);
  };
  window.addEventListener("resize", onResize);

  const pos = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, r };
  };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch" || !visible) return;
    const p = pos(e);
    mouse.inside = p.x > 0 && p.y > 0 && p.x < p.r.width && p.y < p.r.height;
    if (mouse.px < 0 || !mouse.inside) {
      mouse.px = p.x;
      mouse.py = p.y;
    }
    mouse.x = p.x;
    mouse.y = p.y;
    if (mouse.inside) {
      lastTouch = simTime;
      host.dispatchEvent(new Event("ink:touched"));
    }
  };
  const onDown = (e: PointerEvent) => {
    if ((e.target as Element)?.closest?.("a,button")) return;
    const p = pos(e);
    lastTouch = simTime;
    host.dispatchEvent(new Event("ink:touched"));
    if (e.pointerType !== "touch") mouse.down = true;
    drop(p.x / W, 1 - p.y / H, 1.2, 0, 0);
    if (o.still()) settle(50);
  };
  const onUp = () => (mouse.down = false);
  window.addEventListener("pointermove", onMove, { passive: true });
  host.addEventListener("pointerdown", onDown);
  window.addEventListener("pointerup", onUp);

  return {
    dropAt(x, y, amt) {
      drop(x / W, 1 - y / H, amt, rand(-0.002, 0.002), rand(-0.002, 0.002));
      if (o.still()) settle(40);
    },
    motion() {
      if (o.still()) {
        stop();
        draw();
      } else start();
    },
    destroy() {
      stop();
      clearTimeout(rt);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      [A, B].forEach((t) => {
        if (t) {
          G.deleteTexture(t.tex);
          G.deleteFramebuffer(t.fb);
        }
      });
      G.deleteBuffer(buf);
      G.deleteProgram(advect.p);
      G.deleteProgram(display.p);
    },
  };
}
