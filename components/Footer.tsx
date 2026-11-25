"use client";

import { useEffect, useRef, useState } from "react";
import { footerPills, site, socials } from "@/content/site";
import { isStill, finePointer } from "@/lib/motion";
import ContactForm from "./ContactForm";

function RollWord({ text }: { text: string }) {
  return (
    <span className="roll-word" aria-hidden="true">
      {[...text].map((c, i) => (
        <span key={i} className="ch" style={{ ["--i" as string]: i }} data-c={c}>
          <span>{c}</span>
        </span>
      ))}
    </span>
  );
}

function CopyEmail() {
  const [msg, setMsg] = useState("Copy");
  return (
    <button
      type="button"
      className="pill"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(site.email);
          setMsg("Copied ✓");
        } catch {
          setMsg("Select & copy");
        }
        setTimeout(() => setMsg("Copy"), 1600);
      }}
    >
      <span className="roll" data-text={msg}>
        <span>{msg}</span>
      </span>
    </button>
  );
}

/* ---------- pills of the toolkit fall into the footer and pile up; the cursor pushes them around ---------- */
function usePhysics(area: React.RefObject<HTMLDivElement | null>, canvas: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const box = area.current!;
    const cv = canvas.current!;
    let destroy: (() => void) | null = null;
    let cancelled = false;

    const startSim = async () => {
      if (destroy || cancelled || isStill()) return;
      const Matter = (await import("matter-js")).default;
      if (cancelled) return;
      const { Engine, Bodies, Body, Composite } = Matter;
      const dpr = Math.min(2, devicePixelRatio || 1);
      const W = box.clientWidth;
      const H = box.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      cv.style.width = `${W}px`;
      cv.style.height = `${H}px`;
      const ctx = cv.getContext("2d")!;
      ctx.scale(dpr, dpr);

      const engine = Engine.create();
      engine.gravity.y = 1.05;
      const wall = 400;
      Composite.add(engine.world, [
        Bodies.rectangle(W / 2, H + wall / 2, W + wall * 2, wall, { isStatic: true }),
        Bodies.rectangle(-wall / 2, H / 2, wall, H * 4, { isStatic: true }),
        Bodies.rectangle(W + wall / 2, H / 2, wall, H * 4, { isStatic: true }),
      ]);
      // the big words are solid: pills land on them
      const br = box.getBoundingClientRect();
      box.querySelectorAll<HTMLElement>("[data-solid]").forEach((el) => {
        const r = el.getBoundingClientRect();
        Composite.add(
          engine.world,
          Bodies.rectangle(r.left - br.left + r.width / 2, r.top - br.top + r.height / 2, r.width, r.height * 0.72, { isStatic: true }),
        );
      });

      const small = W < 768;
      const fs = small ? 13 : 16;
      ctx.font = `500 ${fs}px ${getComputedStyle(document.body).fontFamily}`;
      const palette = [
        { bg: "#2337ff", fg: "#ecebe7" },
        { bg: "#141210", fg: "#ecebe7" },
        { bg: "#ffffff", fg: "#141210" },
        { bg: "#d9ff3d", fg: "#141210" },
      ];
      type Pill = { body: Matter.Body; w: number; h: number; label: string; c: (typeof palette)[number] };
      const pills: Pill[] = [];
      const list = small ? footerPills.slice(0, 9) : footerPills;
      const timers: ReturnType<typeof setTimeout>[] = [];
      list.forEach((label, i) => {
        timers.push(
          setTimeout(() => {
            const w = ctx.measureText(label).width + fs * 2.2;
            const h = fs * 2.6;
            const x = w / 2 + Math.random() * (W - w);
            const body = Bodies.rectangle(x, -h - Math.random() * 60, w, h, {
              chamfer: { radius: h / 2 },
              restitution: 0.55,
              friction: 0.2,
              frictionAir: 0.004,
              angle: (Math.random() - 0.5) * 0.8,
            });
            Composite.add(engine.world, body);
            pills.push({ body, w, h, label, c: palette[i % palette.length] });
          }, 120 * i),
        );
      });

      // an invisible ball that follows the mouse and shoves pills out of the way
      const pusher = Bodies.circle(-999, -999, small ? 30 : 44, { isStatic: true });
      Composite.add(engine.world, pusher);
      let mx = -999;
      let my = -999;
      const onMove = (e: PointerEvent) => {
        const r = cv.getBoundingClientRect();
        mx = e.clientX - r.left;
        my = e.clientY - r.top;
      };
      if (finePointer()) window.addEventListener("pointermove", onMove, { passive: true });

      let running = true;
      let raf = 0;
      let last = performance.now();
      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        pills.forEach(({ body, w, h, label, c }) => {
          ctx.save();
          ctx.translate(body.position.x, body.position.y);
          ctx.rotate(body.angle);
          ctx.beginPath();
          ctx.roundRect(-w / 2, -h / 2, w, h, h / 2);
          ctx.fillStyle = c.bg;
          ctx.fill();
          if (c.bg === "#ffffff") {
            ctx.strokeStyle = "rgba(20,18,16,.18)";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          ctx.fillStyle = c.fg;
          ctx.fillText(label, 0, 1);
          ctx.restore();
        });
      };
      const loop = (t: number) => {
        raf = requestAnimationFrame(loop);
        if (!running) return;
        const dt = Math.min(32, t - last);
        last = t;
        const inside = mx > 0 && my > 0 && mx < W && my < H;
        const prev = { ...pusher.position };
        Body.setPosition(pusher, inside ? { x: mx, y: my } : { x: -999, y: -999 });
        if (inside) Body.setVelocity(pusher, { x: (mx - prev.x) * 0.5, y: (my - prev.y) * 0.5 });
        Engine.update(engine, dt);
        draw();
      };
      raf = requestAnimationFrame(loop);
      const io = new IntersectionObserver(([e]) => {
        running = e.isIntersecting;
        last = performance.now();
      });
      io.observe(box);

      destroy = () => {
        cancelAnimationFrame(raf);
        timers.forEach(clearTimeout);
        io.disconnect();
        window.removeEventListener("pointermove", onMove);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
        ctx.clearRect(0, 0, W, H);
      };
    };

    const near = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          near.disconnect();
          startSim();
        }
      },
      { threshold: 0.25 },
    );
    near.observe(box);

    let w = innerWidth;
    const onResize = () => {
      if (innerWidth === w) return;
      w = innerWidth;
      destroy?.();
      destroy = null;
      startSim();
    };
    const onMotion = () => {
      if (isStill()) {
        destroy?.();
        destroy = null;
      } else startSim();
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("hl:motion", onMotion);
    return () => {
      cancelled = true;
      near.disconnect();
      destroy?.();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("hl:motion", onMotion);
    };
  }, [area, canvas]);
}

export default function Footer() {
  const area = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const big = useRef<HTMLAnchorElement>(null);
  usePhysics(area, canvas);

  // the big letters lift away from the cursor
  useEffect(() => {
    if (!finePointer()) return;
    const el = area.current!;
    let mx = -1e4;
    let my = -1e4;
    let raf = 0;
    const lift = () => {
      raf = 0;
      const still = isStill();
      el.querySelectorAll<HTMLElement>(".roll-word .ch").forEach((l) => {
        if (still) return (l.style.translate = "");
        const b = l.getBoundingClientRect();
        const fs = b.height || 1;
        const dx = b.left + b.width / 2 - mx;
        const dy = b.top + b.height / 2 - my;
        const d = Math.hypot(dx, dy);
        const k = Math.exp((-d * d) / (fs * fs * 1.4));
        l.style.translate = `${((dx / (d + 1)) * k * fs * 0.08).toFixed(1)}px ${(-k * fs * 0.12).toFixed(1)}px`;
      });
    };
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(lift);
    };
    const onLeave = () => {
      mx = my = -1e4;
      if (!raf) raf = requestAnimationFrame(lift);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const year = new Date().getFullYear();
  const rows = [
    { k: "Email", v: site.email, href: `mailto:${site.email}`, action: <CopyEmail /> },
    { k: "Phone", v: site.phone, href: site.phoneHref },
    ...socials.map((s) => ({ k: s.label, v: s.handle, href: s.href })),
  ];

  return (
    <footer className="footer" id="contact" aria-labelledby="contact-title">
      <div className="footer__stage" ref={area}>
        <canvas className="footer__canvas" ref={canvas} aria-hidden="true" />
        <p className="label mono footer__label">
          <span>(07)</span> Contact
        </p>
        <h2 className="footer__title" id="contact-title">
          <a href={`mailto:${site.email}`} ref={big} aria-label="Let's connect: email Harsha">
            <span className="footer__line" data-solid>
              <RollWord text="Let's" />
            </span>
            <span className="footer__line footer__line--right" data-solid>
              <RollWord text="connect!" />
            </span>
          </a>
        </h2>
      </div>

      <div className="footer__grid">
        <div className="footer__intro">
          <p className="footer__lead" data-reveal>
            Have a product, a website or a messy dataset in mind? Tell me about it. I reply within a day or two.
          </p>
          <ul className="footer__rows" data-reveal-rule>
            {rows.map((r) => (
              <li key={r.k}>
                <span className="mono">{r.k}</span>
                <a href={r.href} {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  {r.v}
                </a>
                {"action" in r && r.action ? (
                  r.action
                ) : (
                  <a
                    className="pill"
                    href={r.href}
                    aria-hidden="true"
                    tabIndex={-1}
                    {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <span className="roll" data-text="Open ↗">
                      <span>Open ↗</span>
                    </span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="footer__form" data-reveal>
          <h3 className="mono footer__form-title">Or send a message</h3>
          <ContactForm />
        </div>
      </div>

      <div className="footer__base mono">
        <p>
          © {year} {site.name}
        </p>
        <p className="footer__made">Designed &amp; built in {site.country}</p>
        <a href="#top" className="footer__top">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
