"use client";

import { useEffect, useRef } from "react";
import { finePointer, isStill } from "@/lib/motion";

const N = 6;

/**
 * The cursor is a drop of ink. Smaller drops trail behind it and a goo filter melts
 * them into one liquid shape, so it stretches when you move fast and pulls back
 * together when you stop. It swells over anything clickable and splashes on press.
 * Mouse / trackpad only; touch and keyboard users keep their normal behaviour.
 */
export default function InkCursor() {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!finePointer()) return;
    const root = wrap.current!;
    const dots = Array.from(root.querySelectorAll<HTMLElement>(".ink__dot"));
    const html = document.documentElement;
    const pts = dots.map(() => ({ x: -100, y: -100 }));
    let mx = -100;
    let my = -100;
    let size = 1;
    let sizeT = 1;
    let splash = 0;
    let visible = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        pts.forEach((p) => ((p.x = mx), (p.y = my)));
        root.classList.add("is-on");
        html.classList.add("has-ink");
      }
      const t = e.target as Element | null;
      const hot = t?.closest?.("a, button, [role='button'], label, [data-cursor], select, summary");
      const text = t?.closest?.("input, textarea, [contenteditable]");
      sizeT = text ? 0.35 : hot ? 2.6 : 1;
      root.classList.toggle("is-hot", !!hot && !text);
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      visible = false;
      root.classList.remove("is-on");
    };
    const onDown = () => {
      splash = 1;
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const loop = () => {
      raf = 0;
      const still = isStill();
      size += (sizeT - size) * 0.18;
      splash *= 0.86;
      let moving = Math.abs(sizeT - size) > 0.01 || splash > 0.01;
      pts.forEach((p, i) => {
        const tx = i === 0 ? mx : pts[i - 1].x;
        const ty = i === 0 ? my : pts[i - 1].y;
        const k = still ? 1 : i === 0 ? 0.5 : 0.42;
        p.x += (tx - p.x) * k;
        p.y += (ty - p.y) * k;
        if (Math.abs(tx - p.x) + Math.abs(ty - p.y) > 0.2) moving = true;
        const s = (i === 0 ? size : (1 - i / (N + 2)) * Math.max(0.6, size * 0.6)) * (1 + splash * (i === 0 ? 0.6 : 1.4));
        dots[i].style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${s.toFixed(3)})`;
      });
      if (moving) raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      html.classList.remove("has-ink");
    };
  }, []);

  return (
    <div className="ink" ref={wrap} aria-hidden="true">
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="hl-ink-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" />
        </filter>
      </svg>
      <div className="ink__goo">
        {Array.from({ length: N }, (_, i) => (
          <i key={i} className="ink__dot" />
        ))}
      </div>
    </div>
  );
}
