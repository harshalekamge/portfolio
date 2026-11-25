"use client";

import { useEffect, useRef } from "react";
import { clamp, isStill, Spring } from "@/lib/motion";

/* ---------- one continuous pen line: idea → code → data → live ---------- */
type P = [number, number];
const W = 1200;
const H = 250;
const BASE = 212;

function build() {
  const pts: P[] = [];
  const marks: number[] = []; // index in pts where each doodle ends
  const add = (x: number, y: number) => pts.push([x, y]);
  const arc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 28) => {
    for (let i = 0; i <= n; i++) {
      const a = a0 + ((a1 - a0) * i) / n;
      add(cx + rx * Math.cos(a), cy + ry * Math.sin(a));
    }
  };

  // a nervous little scribble to warm the pen up
  for (let i = 0; i <= 6; i++) add(14 + i * 14, BASE - 26 + (i % 2 ? -12 : 12) * (1 - i / 9));
  add(120, BASE);

  // 1. idea: a light bulb
  add(214, BASE);
  add(236, BASE);
  add(236, BASE - 40);
  arc(258, BASE - 96, 52, 56, Math.PI * 0.62, Math.PI * 2.38, 40);
  add(280, BASE - 40);
  add(280, BASE);
  add(236, BASE);
  add(236, BASE - 18);
  add(280, BASE - 18);
  add(280, BASE);
  marks.push(pts.length - 1);

  // 2. code: { / }
  add(420, BASE);
  add(470, BASE);
  add(470, BASE - 20);
  arc(484, BASE - 20, 14, 14, Math.PI, Math.PI * 1.5, 8);
  add(484, BASE - 70);
  add(468, BASE - 84);
  add(484, BASE - 98);
  add(484, BASE - 150);
  arc(498, BASE - 150, 14, 14, Math.PI, Math.PI * 1.5, 8);
  add(520, BASE - 164);
  add(512, BASE - 164);
  add(540, BASE - 30);
  add(546, BASE - 30);
  add(546, BASE - 164);
  add(572, BASE - 164);
  arc(572, BASE - 150, 14, 14, -Math.PI * 0.5, 0, 8);
  add(586, BASE - 98);
  add(602, BASE - 84);
  add(586, BASE - 70);
  add(586, BASE - 20);
  arc(572, BASE - 20, 14, 14, 0, Math.PI * 0.5, 8);
  add(560, BASE);
  marks.push(pts.length - 1);

  // 3. data: a bar chart with a trend line
  add(700, BASE);
  add(730, BASE);
  add(730, BASE - 60);
  add(758, BASE - 60);
  add(758, BASE);
  add(770, BASE);
  add(770, BASE - 104);
  add(798, BASE - 104);
  add(798, BASE);
  add(810, BASE);
  add(810, BASE - 150);
  add(838, BASE - 150);
  add(838, BASE);
  add(850, BASE);
  add(850, BASE - 82);
  add(878, BASE - 82);
  add(878, BASE);
  marks.push(pts.length - 1);

  // 4. live: a browser window (this one fills in when the line arrives)
  add(960, BASE);
  add(990, BASE);
  const wx = 990;
  const wy = BASE - 150;
  const ww = 190;
  add(wx, wy);
  add(wx + ww, wy);
  add(wx + ww, BASE);
  add(wx, BASE);
  add(wx, wy + 30);
  add(wx + ww, wy + 30);
  add(wx + 30, wy + 30);
  arc(wx + 20, wy + 15, 6, 6, 0, Math.PI * 2, 10);
  marks.push(pts.length - 1);
  const screen: P[] = [
    [wx + 14, wy + 44],
    [wx + ww - 14, wy + 44],
    [wx + ww - 14, BASE - 14],
    [wx + 14, BASE - 14],
  ];
  return { pts, marks, screen };
}

function ink(pts: P[]) {
  // resample, then wobble the line sideways so it reads as a hand-held pen
  const dense: P[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 4));
    for (let k = 0; k < n; k++) dense.push([x0 + ((x1 - x0) * k) / n, y0 + ((y1 - y0) * k) / n]);
  }
  dense.push(pts[pts.length - 1]);
  const len = [0];
  for (let i = 1; i < dense.length; i++) len[i] = len[i - 1] + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]);
  const total = len[len.length - 1];
  const out = dense.map(([x, y], i) => {
    const a = len[i];
    const amp = 2.2 * Math.pow(1 - a / total, 1.4) + 0.6;
    const o = Math.sin(a * 0.045 + 1.3) * 0.55 + Math.sin(a * 0.013 + 0.4) * 0.35 + Math.sin(a * 0.11 + 2.1) * 0.2;
    const p = dense[Math.max(0, i - 2)];
    const q = dense[Math.min(dense.length - 1, i + 2)];
    const dx = q[0] - p[0];
    const dy = q[1] - p[1];
    const d = Math.hypot(dx, dy) || 1;
    return [x - (dy / d) * amp * o, y + (dx / d) * amp * o] as P;
  });
  return { d: "M" + out.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L"), dense, len, total };
}

const shape = build();
const line = ink(shape.pts);
// where along the line each doodle is finished (0..1)
const stops = shape.marks.map((m) => {
  const [mx, my] = shape.pts[m];
  let best = 0;
  let bd = Infinity;
  line.dense.forEach(([x, y], i) => {
    const d = Math.hypot(x - mx, y - my);
    if (d < bd) ((bd = d), (best = i));
  });
  return line.len[best] / line.total;
});
const tags = [
  { label: "An idea", x: 258 },
  { label: "The code", x: 535 },
  { label: "The data", x: 804 },
  { label: "It's live", x: 1085 },
];

export default function Process() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const path = el.querySelector<SVGPathElement>(".process__path")!;
    const tip = el.querySelector<SVGCircleElement>(".process__tip")!;
    const tagEls = Array.from(el.querySelectorAll<HTMLElement>(".process__tag"));
    const L = path.getTotalLength();
    path.style.strokeDasharray = `${L} ${L}`;

    const draw = (p: number) => {
      path.style.strokeDashoffset = (L * (1 - p)).toFixed(1);
      if (p > 0.002 && p < 0.995) {
        const pt = path.getPointAtLength(L * p);
        tip.setAttribute("cx", String(pt.x));
        tip.setAttribute("cy", String(pt.y));
        tip.style.opacity = "1";
      } else tip.style.opacity = "0";
      tagEls.forEach((t, i) => t.classList.toggle("is-on", p >= stops[i] - 0.01));
      el.classList.toggle("is-lit", p >= 0.995);
    };
    const target = () => {
      const r = el.getBoundingClientRect();
      const start = innerHeight * 0.92;
      const end = innerHeight * 0.35;
      return clamp((start - r.top) / (start - end));
    };

    if (isStill()) {
      draw(1);
      return;
    }
    const s = new Spring(target(), 0.9);
    draw(s.v);
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      const dt = Math.min(0.033, (t - last) / 1000);
      last = t;
      s.t = isStill() ? 1 : target();
      s.step(dt);
      draw(clamp(s.v));
      raf = s.still() ? 0 : requestAnimationFrame(loop);
    };
    const kick = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("scroll", kick, { passive: true });
    document.addEventListener("hl:motion", kick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
      document.removeEventListener("hl:motion", kick);
    };
  }, []);

  const scr = shape.screen;
  return (
    <section className="process" aria-labelledby="process-title">
      <div className="process__head">
        <p className="label mono">
          <span>(02)</span> How I work
        </p>
        <h2 className="process__title" id="process-title" data-reveal-lines>
          Most of my work starts with a question and ends somewhere you can click.
        </h2>
      </div>
      <div className="process__line" ref={root}>
        <svg viewBox={`0 0 ${W} ${H}`} className="process__svg" aria-hidden="true">
          <path className="process__screen" d={`M${scr.map((p) => p.join(" ")).join("L")}Z`} />
          <path className="process__path" d={line.d} />
          <circle className="process__tip" r="6" cx="-20" cy="-20" />
        </svg>
        {tags.map((t, i) => (
          <span key={t.label} className="process__tag mono" style={{ left: `${(t.x / W) * 100}%` }}>
            <i>0{i + 1}</i> {t.label}
          </span>
        ))}
      </div>
      <div className="process__body">
        <p data-reveal>
          I start where most problems actually live: with the people who have them. Then I sketch it, build it, measure
          it, and keep going until it feels obvious.
        </p>
        <p data-reveal className="muted">
          Design, front-end, back-end and data in one head means fewer handoffs and nothing lost in translation.
        </p>
      </div>
    </section>
  );
}
