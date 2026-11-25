"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { setupGsap } from "@/lib/motion";

const COLS = 12;

/**
 * Intro, once per visit.
 * A count runs to 100 while drops of ink orbit and merge in the middle (a goo filter melts
 * them together). At 100 the drops flood, the copy drops away and the sheet lifts off
 * column by column, from the middle outwards, uncovering the hero as it goes.
 */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const drops = useRef<SVGGElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current!;
    if (!html.hasAttribute("data-loading")) {
      el.remove();
      return;
    }
    setupGsap();
    const circles = Array.from(drops.current!.querySelectorAll("circle"));
    const seeds = circles.map((_, i) => ({
      a: (i / circles.length) * Math.PI * 2,
      s: 0.6 + Math.random() * 0.9,
      o: 18 + Math.random() * 22,
      r: 6 + Math.random() * 8,
    }));

    let loaded = document.readyState === "complete";
    const onLoad = () => (loaded = true);
    window.addEventListener("load", onLoad);
    const failSafe = setTimeout(() => (loaded = true), 4000);

    const t0 = performance.now();
    let shown = 0;
    let flood = 0;
    let done = false;
    let raf = 0;

    const frame = () => {
      const t = (performance.now() - t0) / 1000;
      const goal = loaded && t > 1.2 ? 100 : Math.min(88, 100 * (1 - Math.exp(-t * 0.9)));
      shown += (goal - shown) * (loaded ? 0.14 : 0.06);
      if (goal === 100 && shown > 98.6) shown = 100;
      if (num.current) num.current.textContent = String(Math.floor(shown)).padStart(2, "0");
      const p = shown / 100;
      if (shown === 100 && !done) {
        done = true;
        finish();
      }
      if (done) flood = Math.min(1, flood + 0.04);
      circles.forEach((c, k) => {
        const d = seeds[k];
        const ang = d.a + t * d.s * (k % 2 ? -1 : 1);
        const orbit = d.o * (1 - p * 0.75) * (1 - flood) + Math.sin(t * 2 + k) * 4 * (1 - flood);
        c.setAttribute("cx", (Math.cos(ang) * orbit).toFixed(2));
        c.setAttribute("cy", (Math.sin(ang) * orbit).toFixed(2));
        c.setAttribute("r", (d.r * (0.7 + p * 0.9) + flood * 160).toFixed(2));
      });
      if (flood < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    function finish() {
      const cols = Array.from(el.querySelectorAll<HTMLElement>(".loader__col"));
      const mid = (cols.length - 1) / 2;
      const tl = gsap.timeline({
        onComplete: () => {
          html.removeAttribute("data-loading");
          try {
            sessionStorage.setItem("hl-intro", "1");
          } catch {}
          document.dispatchEvent(new Event("hl:intro-done"));
          el.remove();
        },
      });
      tl.to(el.querySelectorAll(".loader__copy > *"), { yPercent: 110, opacity: 0, duration: 0.5, ease: "power2.in", stagger: 0.04 }, 0.15)
        .to(el.querySelector(".loader__blob"), { scale: 0.2, opacity: 0, duration: 0.5, ease: "power2.in" }, 0.25)
        .call(() => document.dispatchEvent(new Event("hl:intro-reveal")), undefined, 0.62)
        .to(
          cols,
          {
            yPercent: -101,
            duration: 0.9,
            ease: "osmo",
            stagger: (i) => Math.abs(i - mid) * 0.045,
          },
          0.6,
        );
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(failSafe);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <div className="loader" ref={root} aria-hidden="true">
      <div className="loader__cols">
        {Array.from({ length: COLS }, (_, i) => (
          <i key={i} className="loader__col" />
        ))}
      </div>
      <div className="loader__copy loader__name">
        <span>Harsha</span>
        <span>Lekamge</span>
      </div>
      <svg className="loader__blob" viewBox="-100 -100 200 200">
        <defs>
          <filter id="hl-goo" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
          </filter>
        </defs>
        <g filter="url(#hl-goo)" ref={drops}>
          {Array.from({ length: 7 }, (_, i) => (
            <circle key={i} r="6" />
          ))}
        </g>
      </svg>
      <div className="loader__copy loader__note">
        <span>Compiling the ink</span>
      </div>
      <div className="loader__copy loader__count">
        <span ref={num}>00</span>
      </div>
    </div>
  );
}
