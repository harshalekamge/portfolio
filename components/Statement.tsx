"use client";

import { useEffect, useRef } from "react";
import { statement } from "@/content/site";
import { clamp, isStill } from "@/lib/motion";
import Scribble from "./Scribble";

type Unit = { text: string; mark: boolean; tail: string };

function parse(s: string): Unit[] {
  // split into words; a *marked phrase* stays together as one unit, and
  // punctuation right after it ("*code*.") sticks to it instead of floating off
  const out: Unit[] = [];
  s.split(/(\*[^*]+\*)/).forEach((part) => {
    if (!part) return;
    if (part.startsWith("*")) return out.push({ text: part.slice(1, -1), mark: true, tail: "" });
    const m = part.match(/^[^\s]+/);
    let rest = part;
    if (m && out.length && out[out.length - 1].mark) {
      out[out.length - 1].tail = m[0];
      rest = part.slice(m[0].length);
    }
    rest
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w) => out.push({ text: w, mark: false, tail: "" }));
  });
  return out;
}

/** The intro statement pins in place and its words fill in as you scroll through it. */
export default function Statement() {
  const root = useRef<HTMLElement>(null);
  const words = parse(statement);

  useEffect(() => {
    const el = root.current!;
    const ws = Array.from(el.querySelectorAll<HTMLElement>(".statement__w"));
    const bar = el.querySelector<HTMLElement>(".statement__bar")!;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const still = isStill();
      const p = still ? 1 : clamp(-r.top / Math.max(1, r.height - innerHeight));
      const k = clamp(p / 0.82) * (ws.length + 1);
      ws.forEach((w, i) => {
        const o = clamp(k - i);
        w.style.opacity = still ? "" : (0.13 + o * 0.87).toFixed(3);
        w.classList.toggle("is-on", o > 0.95);
      });
      bar.style.setProperty("--p", p.toFixed(3));
    };
    const queue = () => raf || (raf = requestAnimationFrame(update));
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    document.addEventListener("hl:motion", queue);
    update();
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      document.removeEventListener("hl:motion", queue);
    };
  }, []);

  return (
    <section className="statement" id="intro" ref={root} aria-label="Introduction">
      <div className="statement__pin">
        <p className="label mono statement__label">
          <span>(01)</span> Intro
        </p>
        <p className="statement__text">
          {words.map((w, i) => (
            <span key={i}>
              <span className={`statement__w${w.mark ? " is-mark" : ""}`}>
                {w.mark ? (
                  <>
                    <em>
                      {w.text}
                      <Scribble kind={i % 2 ? "underline" : "circle"} className="statement__ink" />
                    </em>
                    {w.tail}
                  </>
                ) : (
                  w.text
                )}
              </span>{" "}
            </span>
          ))}
        </p>
        <div className="statement__bar" aria-hidden="true">
          <i />
        </div>
      </div>
    </section>
  );
}
