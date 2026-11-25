"use client";

import { useEffect, useRef } from "react";

/** Small page-level touches: a slim scroll meter and a tab title that waits for you. */
export default function Chrome() {
  const thumb = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = thumb.current!;
    const doc = document.documentElement;
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = doc.scrollHeight;
      const vh = innerHeight;
      const ratio = Math.max(0.08, Math.min(1, vh / h));
      const p = h > vh ? scrollY / (h - vh) : 0;
      el.style.height = `${ratio * 100}%`;
      el.style.transform = `translateY(${(p * (1 - ratio) * 100) / ratio}%)`;
    };
    const queue = () => raf || (raf = requestAnimationFrame(update));
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    const ro = new ResizeObserver(queue);
    ro.observe(document.body);
    update();

    let title = document.title;
    const away = "Come back, I'll wait.";
    const onVis = () => {
      if (document.hidden) {
        title = document.title;
        document.title = away;
      } else if (document.title === away) document.title = title;
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="scroll-meter" aria-hidden="true">
      <i ref={thumb} />
    </div>
  );
}
