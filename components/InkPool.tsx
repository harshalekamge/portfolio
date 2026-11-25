"use client";

import { useEffect, useRef } from "react";
import { inkWords, site } from "@/content/site";
import { isStill, finePointer } from "@/lib/motion";
import { makeInk } from "@/lib/ink";
import { createSwapper, liftLetters } from "@/lib/swapTitle";

const HOLD = [4200, 2600, 4200, 2600];

/**
 * A pool of ink in milk, in the middle of the page. Move to stir it, click to drop more.
 * The words float on top and invert wherever the ink runs under them (mix-blend: difference),
 * and every time they change a drop of ink lands right behind them.
 */
export default function InkPool() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const title = useRef<HTMLSpanElement>(null);
  const hint = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = root.current!;
    const ink = makeInk(
      canvas.current!,
      host,
      [
        [0.36, 0.6, 0.9, 0.004, -0.002],
        [0.66, 0.4, 0.7, -0.003, 0.003],
      ],
      { still: isStill },
    );
    if (!ink) host.classList.add("no-gl");

    const nudge = () => {
      if (!ink) return;
      const r = title.current!.getBoundingClientRect();
      const h = host.getBoundingClientRect();
      ink.dropAt(r.left - h.left + r.width * (0.2 + Math.random() * 0.6), r.top - h.top + r.height * (0.3 + Math.random() * 0.4), 0.9);
    };
    const swap = createSwapper(title.current!, inkWords, HOLD, { onSwap: nudge, introDelay: 0 });

    // start the words the first time the pool comes into view
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          swap.start();
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(host);

    // the hint fades once someone has played with the ink
    let hintGone = false;
    const onTouched = () => {
      if (hintGone) return;
      hintGone = true;
      setTimeout(() => hint.current?.classList.add("is-gone"), 2500);
    };
    host.addEventListener("ink:touched", onTouched);

    const onMotion = () => ink?.motion();
    document.addEventListener("hl:motion", onMotion);
    const unlift = finePointer() ? liftLetters(host, ".role__ch", 1) : () => {};

    return () => {
      io.disconnect();
      swap.destroy();
      ink?.destroy();
      unlift();
      host.removeEventListener("ink:touched", onTouched);
      document.removeEventListener("hl:motion", onMotion);
    };
  }, []);

  return (
    <section className="inkpool" ref={root} aria-label="Ink pool: move to stir, click to drop ink">
      <canvas className="inkpool__canvas" ref={canvas} aria-hidden="true" />
      <div className="inkpool__over">
        <p className="inkpool__title" aria-hidden="true">
          <span className="inkpool__words" ref={title}>
            <span className="role__layer">
              <span className="role__ln">{inkWords[0][0]}</span>
              <span className="role__ln">{inkWords[0][1]}</span>
            </span>
          </span>
        </p>
        <div className="inkpool__foot mono">
          <span className="inkpool__who">
            Software engineer &amp; data scientist
            <br />
            {site.location}
          </span>
          <span className="inkpool__hint" ref={hint}>
            <span className="inkpool__hint--mouse">Move to stir the ink. Click to drop more.</span>
            <span className="inkpool__hint--touch">Tap to drop some ink.</span>
          </span>
          <a className="inkpool__next" href="#about" tabIndex={-1}>
            Scroll
            <svg viewBox="0 0 14 14" aria-hidden="true">
              <path d="M7 1v12M2 8l5 5 5-5" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
