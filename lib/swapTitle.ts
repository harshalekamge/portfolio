"use client";

import { isStill } from "./motion";

/*
  A two-line title that keeps changing, each time with a different effect:
  roll (split-flap), bleed (soak into water and refocus), split (lines slide apart
  off the edges) and decode (characters compile into place).
  Used by the hero role and the ink pool.
*/

export type Pair = [string, string];

const GLYPHS = "<>/{}[]=+*#_01;:";
const rand = (a: number, b: number) => a + Math.random() * (b - a);

function layer(w: Pair, cls = "") {
  const s = document.createElement("span");
  s.className = "role__layer" + (cls ? " " + cls : "");
  w.forEach((word) => {
    const ln = document.createElement("span");
    ln.className = "role__ln";
    for (const c of word) {
      const l = document.createElement("span");
      l.className = "role__ch";
      l.textContent = c === " " ? " " : c;
      ln.appendChild(l);
    }
    s.appendChild(ln);
  });
  return s;
}
export const titleLetters = (el: Element) => Array.from(el.querySelectorAll<HTMLElement>(".role__ch"));

export function createSwapper(
  el: HTMLElement,
  words: Pair[],
  holds: number[],
  opts: { onSwap?: () => void; introDelay?: number } = {},
) {
  let wi = 0;
  let fx = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let alive = true;
  let started = false;
  const hold = (i: number) => holds[i % holds.length];
  const clean = (w: Pair) => {
    el.innerHTML = "";
    el.appendChild(layer(w));
  };
  const motionOK = () => !isStill() && !!Element.prototype.animate;

  function roll(from: Element, to: Pair, done: () => void) {
    from.classList.add("clip");
    titleLetters(from).forEach((l, i) =>
      l.animate([{ transform: "none" }, { transform: "translateY(-110%)" }], {
        duration: 620,
        delay: i * 30,
        easing: "cubic-bezier(.65,0,.25,1)",
        fill: "forwards",
      }),
    );
    const nl = layer(to, "clip");
    el.appendChild(nl);
    const L = titleLetters(nl);
    L.forEach((l, i) =>
      l.animate([{ transform: "translateY(110%)" }, { transform: "none" }], {
        duration: 700,
        delay: 160 + i * 30,
        easing: "cubic-bezier(.65,0,.25,1)",
        fill: "backwards",
      }),
    );
    timer = setTimeout(() => (clean(to), done()), 160 + L.length * 30 + 760);
  }
  function bleed(from: Element, to: Pair, done: () => void) {
    titleLetters(from).forEach((l) =>
      l.animate(
        [
          { filter: "blur(0px)", opacity: 1, transform: "none" },
          { filter: "blur(22px)", opacity: 0, transform: `translateY(${rand(-30, 30)}px) scale(1.4)` },
        ],
        { duration: 800, delay: rand(0, 300), easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" },
      ),
    );
    const nl = layer(to);
    el.appendChild(nl);
    titleLetters(nl).forEach((l) =>
      l.animate(
        [
          { filter: "blur(22px)", opacity: 0, transform: "scale(1.4)" },
          { filter: "blur(0px)", opacity: 1, transform: "none" },
        ],
        { duration: 1000, delay: 560 + rand(0, 360), easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" },
      ),
    );
    timer = setTimeout(() => (clean(to), done()), 2000);
  }
  function split(from: Element, to: Pair, done: () => void) {
    from.querySelectorAll(".role__ln").forEach((ln, k) =>
      ln.animate(
        [
          { transform: "none", letterSpacing: "-.02em", opacity: 1 },
          { transform: `translateX(${k ? 60 : -60}vw)`, letterSpacing: ".3em", opacity: 0 },
        ],
        { duration: 900, easing: "cubic-bezier(.7,0,.2,1)", fill: "forwards" },
      ),
    );
    const nl = layer(to);
    el.appendChild(nl);
    nl.querySelectorAll(".role__ln").forEach((ln, k) =>
      ln.animate(
        [
          { transform: `translateX(${k ? -60 : 60}vw)`, letterSpacing: ".3em", opacity: 0 },
          { transform: "none", letterSpacing: "-.02em", opacity: 1 },
        ],
        { duration: 1100, delay: 380, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" },
      ),
    );
    timer = setTimeout(() => (clean(to), done()), 1550);
  }
  function decode(_from: Element, to: Pair, done: () => void) {
    const nl = layer(to);
    el.innerHTML = "";
    el.appendChild(nl);
    const L = titleLetters(nl);
    const word = to.join("").replace(/ /g, " ");
    const plan = L.map((_, i) => 260 + i * 48 + rand(0, 200));
    const end = Math.max(...plan);
    const t0 = performance.now();
    const tick = () => {
      if (!alive) return;
      const t = performance.now() - t0;
      L.forEach((l, i) => {
        l.textContent = t < plan[i] ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : word[i];
        l.style.opacity = t < plan[i] ? "0.5" : "1";
      });
      if (t < end + 30) timer = setTimeout(tick, 45);
      else (clean(to), done());
    };
    tick();
  }
  const EFFECTS = [roll, bleed, split, decode];

  const schedule = (ms: number) => {
    clearTimeout(timer);
    if (alive) timer = setTimeout(next, ms);
  };
  function next() {
    if (!alive) return;
    const from = el.querySelector(".role__layer")!;
    wi = (wi + 1) % words.length;
    const to = words[wi];
    if (!motionOK()) {
      clean(to);
      return schedule(hold(wi) + 800);
    }
    opts.onSwap?.();
    const fn = EFFECTS[fx];
    fx = (fx + 1) % EFFECTS.length;
    fn(from, to, () => schedule(hold(wi)));
  }

  clean(words[0]);
  const onVis = () => (document.hidden ? clearTimeout(timer) : started && schedule(hold(wi)));
  document.addEventListener("visibilitychange", onVis);

  return {
    /** fade the first words in (blurred, rising), then start cycling */
    start() {
      if (started) return;
      started = true;
      if (motionOK()) {
        titleLetters(el).forEach((l, i) =>
          l.animate(
            [
              { opacity: 0, transform: "translateY(40%)", filter: "blur(14px)" },
              { opacity: 1, transform: "none", filter: "blur(0px)" },
            ],
            { duration: 1200, delay: (opts.introDelay ?? 300) + i * 45, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" },
          ),
        );
        schedule(hold(0) + 1400);
      } else schedule(hold(0));
    },
    pause() {
      clearTimeout(timer);
    },
    resume() {
      if (started) schedule(hold(wi));
    },
    destroy() {
      alive = false;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVis);
    },
  };
}

/** Letters lean away from the cursor, as if floating on water. Returns a cleanup. */
export function liftLetters(area: HTMLElement, selector: string, strength = 1) {
  let mx = -1e4;
  let my = -1e4;
  let raf = 0;
  const lift = () => {
    raf = 0;
    const still = isStill();
    area.querySelectorAll<HTMLElement>(selector).forEach((l) => {
      if (still) return (l.style.translate = "");
      const b = l.getBoundingClientRect();
      const fs = b.height || 1;
      const dx = b.left + b.width / 2 - mx;
      const dy = b.top + b.height / 2 - my;
      const d = Math.hypot(dx, dy);
      const k = Math.exp((-d * d) / (fs * fs * 1.3));
      l.style.translate = `${((dx / (d + 1)) * k * fs * 0.08 * strength).toFixed(1)}px ${(-k * fs * 0.12 * strength).toFixed(1)}px`;
    });
  };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    mx = e.clientX;
    my = e.clientY;
    if (!raf) raf = requestAnimationFrame(lift);
  };
  const onLeave = () => {
    mx = my = -1e4;
    if (!raf) raf = requestAnimationFrame(lift);
  };
  area.addEventListener("pointermove", onMove);
  area.addEventListener("pointerleave", onLeave);
  return () => {
    cancelAnimationFrame(raf);
    area.removeEventListener("pointermove", onMove);
    area.removeEventListener("pointerleave", onLeave);
  };
}
