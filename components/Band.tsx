"use client";

import { useEffect, useRef } from "react";
import { band } from "@/content/site";
import { isStill } from "@/lib/motion";

/** A band of words that drifts on its own, speeds up with your scroll and flips direction with it. */
export default function Band() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current!;
    let x = 0;
    let lastY = scrollY;
    let boost = 0;
    let dir = 1;
    let raf = 0;
    let visible = false;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(el);
    function loop() {
      raf = 0;
      if (!visible) return;
      raf = requestAnimationFrame(loop);
      const y = scrollY;
      const dy = y - lastY;
      lastY = y;
      if (isStill()) {
        el.style.transform = "";
        return;
      }
      if (Math.abs(dy) > 0.5) dir = dy > 0 ? 1 : -1;
      boost += (Math.min(Math.abs(dy), 80) * 0.25 - boost) * 0.1;
      x -= (0.6 + boost) * dir;
      const half = el.scrollWidth / 3; // one copy of the row
      if (half > 0) {
        if (-x > half) x += half;
        if (x > 0) x -= half;
      }
      el.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
    }
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const row = (hidden: boolean) =>
    band.map((b) => (
      <span key={b + hidden} className="band__item" aria-hidden={hidden || undefined}>
        {b}
        <i className="band__dot" aria-hidden="true" />
      </span>
    ));

  return (
    <div className="band" role="presentation">
      <div className="band__track" ref={track}>
        {row(false)}
        {row(true)}
        {row(true)}
      </div>
    </div>
  );
}
