"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { projects, roles, site } from "@/content/site";
import { setupGsap, isStill, finePointer, afterIntro } from "@/lib/motion";
import Scribble from "./Scribble";

const slotA = [projects[0], projects[2], projects[1]];
const slotB = [projects[1], projects[0], projects[2]];

function Letters({ word }: { word: string }) {
  return (
    <span className="hero__word" data-word>
      <span>
        {[...word].map((ch, i) => (
          <span key={i} className="hero__ch">
            {ch}
          </span>
        ))}
      </span>
    </span>
  );
}

function Slot({ items, className, label, sizes }: { items: typeof projects; className: string; label: string; sizes: string }) {
  return (
    <a className={`hero__slot ${className}`} href="#work" data-slot aria-label={label} data-cursor>
      {items.map((p, i) => (
        <span className="hero__ph" key={p.slug} style={{ zIndex: i === 0 ? 2 : 0, ["--tone" as string]: p.tone }}>
          <Image
            src={p.image}
            alt=""
            fill
            sizes={sizes}
            priority={i === 0}
            style={{ objectFit: "cover", objectPosition: "50% 20%" }}
          />
        </span>
      ))}
    </a>
  );
}

/* ---------- the role under the name: four different ways to change it ---------- */
const GLYPHS = "<>/{}[]=+*#_01;:";
const HOLD = [4200, 2600, 3200, 2600];
const rand = (a: number, b: number) => a + Math.random() * (b - a);

function layer(w: [string, string], cls = "") {
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
const letters = (el: Element) => Array.from(el.querySelectorAll<HTMLElement>(".role__ch"));

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const role = useRef<HTMLSpanElement>(null);

  // entrance + rotating image slots
  useEffect(() => {
    setupGsap();
    const el = root.current!;
    const words = el.querySelectorAll(".hero__word > span");
    const slots = Array.from(el.querySelectorAll<HTMLElement>("[data-slot]"));
    const pen = el.querySelector<SVGPathElement>(".hero__mark path");
    const fades = el.querySelectorAll("[data-hero-fade]");
    const cue = el.querySelector(".hero__cue i");
    const still = isStill();
    let ticker: ReturnType<typeof setInterval> | undefined;
    let hover = 0;
    let inView = true;

    const cycle = () => {
      const state = slots.map(() => 0);
      let n = 0;
      ticker = setInterval(() => {
        if (hover || !inView || document.hidden || isStill()) return;
        const k = n++ % slots.length;
        const layers = Array.from(slots[k].querySelectorAll<HTMLElement>(".hero__ph"));
        const next = (state[k] + 1) % layers.length;
        layers.forEach((l, i) => (l.style.zIndex = i === next ? "2" : i === state[k] ? "1" : "0"));
        gsap.fromTo(layers[next], { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, clearProps: "clipPath" });
        state[k] = next;
      }, 1300);
    };
    const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting));
    io.observe(el);
    slots.forEach((s) => {
      s.addEventListener("pointerenter", () => hover++);
      s.addEventListener("pointerleave", () => (hover = Math.max(0, hover - 1)));
    });

    if (still) {
      el.classList.add("is-in");
      cycle();
      return () => {
        clearInterval(ticker);
        io.disconnect();
      };
    }

    const ctx = gsap.context(() => {
      gsap.set(words, { y: 0, yPercent: 110 });
      gsap.set(slots, { clipPath: "inset(0% 100% 0% 0%)" });
      gsap.set(fades, { opacity: 0, y: "1em" });
      if (pen) gsap.set(pen, { strokeDashoffset: 1 });
      if (cue) gsap.set(cue, { scaleY: 0 });
      el.classList.add("is-in");
    }, el);

    const stop = afterIntro(() => {
      ctx.add(() => {
        gsap
          .timeline({ delay: 0.05, onComplete: cycle })
          .to(words, { yPercent: 0, duration: 1, stagger: 0.07 }, 0)
          .to(slots, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, stagger: 0.12, clearProps: "clipPath" }, 0.2)
          .to(pen, { strokeDashoffset: 0, duration: 1.1, ease: "power1.inOut" }, 0.6)
          .to(fades, { opacity: 1, y: 0, duration: 0.8, stagger: 0.06 }, 0.35)
          .to(cue, { scaleY: 1, duration: 0.9 }, 0.6);
      });
    });

    return () => {
      stop();
      clearInterval(ticker);
      io.disconnect();
      ctx.revert();
    };
  }, []);

  // role rotator (roll, bleed, split, decode) + letters that float away from the cursor
  useEffect(() => {
    const el = role.current!;
    const hero = root.current!;
    let wi = 0;
    let fx = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let alive = true;
    const clean = (w: [string, string]) => {
      el.innerHTML = "";
      el.appendChild(layer(w));
    };
    const motionOK = () => !isStill() && !!Element.prototype.animate;

    function roll(from: Element, to: [string, string], done: () => void) {
      from.classList.add("clip");
      letters(from).forEach((l, i) =>
        l.animate([{ transform: "none" }, { transform: "translateY(-110%)" }], { duration: 620, delay: i * 30, easing: "cubic-bezier(.65,0,.25,1)", fill: "forwards" }),
      );
      const nl = layer(to, "clip");
      el.appendChild(nl);
      const L = letters(nl);
      L.forEach((l, i) =>
        l.animate([{ transform: "translateY(110%)" }, { transform: "none" }], { duration: 700, delay: 160 + i * 30, easing: "cubic-bezier(.65,0,.25,1)", fill: "backwards" }),
      );
      timer = setTimeout(() => (clean(to), done()), 160 + L.length * 30 + 760);
    }
    function bleed(from: Element, to: [string, string], done: () => void) {
      letters(from).forEach((l) =>
        l.animate(
          [
            { filter: "blur(0px)", opacity: 1, transform: "none" },
            { filter: "blur(20px)", opacity: 0, transform: `translateY(${rand(-30, 30)}px) scale(1.4)` },
          ],
          { duration: 800, delay: rand(0, 300), easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" },
        ),
      );
      const nl = layer(to);
      el.appendChild(nl);
      letters(nl).forEach((l) =>
        l.animate(
          [
            { filter: "blur(20px)", opacity: 0, transform: "scale(1.4)" },
            { filter: "blur(0px)", opacity: 1, transform: "none" },
          ],
          { duration: 1000, delay: 560 + rand(0, 360), easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" },
        ),
      );
      timer = setTimeout(() => (clean(to), done()), 2000);
    }
    function split(from: Element, to: [string, string], done: () => void) {
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
    function decode(_from: Element, to: [string, string], done: () => void) {
      const nl = layer(to);
      el.innerHTML = "";
      el.appendChild(nl);
      const L = letters(nl);
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
      timer = setTimeout(next, ms);
    };
    function next() {
      if (!alive) return;
      const from = el.querySelector(".role__layer")!;
      wi = (wi + 1) % roles.length;
      const to = roles[wi];
      if (!motionOK()) {
        clean(to);
        return schedule(HOLD[wi % HOLD.length] + 800);
      }
      const fn = EFFECTS[fx];
      fx = (fx + 1) % EFFECTS.length;
      fn(from, to, () => schedule(HOLD[wi % HOLD.length]));
    }

    clean(roles[0]);
    const startRoles = () => {
      if (motionOK()) {
        letters(el).forEach((l, i) =>
          l.animate(
            [
              { opacity: 0, transform: "translateY(40%)", filter: "blur(14px)" },
              { opacity: 1, transform: "none", filter: "blur(0px)" },
            ],
            { duration: 1200, delay: 450 + i * 45, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" },
          ),
        );
        schedule(HOLD[0] + 1400);
      } else schedule(HOLD[0]);
    };
    const stop = afterIntro(startRoles);
    const onVis = () => (document.hidden ? clearTimeout(timer) : schedule(HOLD[wi % HOLD.length]));
    document.addEventListener("visibilitychange", onVis);

    // the big letters lean away from the cursor, as if floating on water
    let mx = -1e4;
    let my = -1e4;
    let raf = 0;
    const chars = () => Array.from(hero.querySelectorAll<HTMLElement>(".hero__ch, .role__ch"));
    const lift = () => {
      raf = 0;
      const still = isStill();
      chars().forEach((l) => {
        if (still) return (l.style.translate = "");
        const b = l.getBoundingClientRect();
        const fs = b.height || 1;
        const dx = b.left + b.width / 2 - mx;
        const dy = b.top + b.height / 2 - my;
        const d = Math.hypot(dx, dy);
        const k = Math.exp((-d * d) / (fs * fs * 1.2));
        l.style.translate = `${((dx / (d + 1)) * k * fs * 0.07).toFixed(1)}px ${(-k * fs * 0.11).toFixed(1)}px`;
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
    if (finePointer()) {
      hero.addEventListener("pointermove", onMove);
      hero.addEventListener("pointerleave", onLeave);
    }

    return () => {
      alive = false;
      stop();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section className="hero" id="top" ref={root} aria-labelledby="hero-title">
      <h1 className="hero__title" id="hero-title" aria-label="Harsha Lekamge">
        <span className="hero__line">
          <Letters word="Harsha" />
          <Slot items={slotA} className="hero__slot--a" label="See selected work" sizes="(max-width: 767px) 40vw, 18vw" />
        </span>
        <span className="hero__line hero__line--indent">
          <Slot items={slotB} className="hero__slot--b" label="See selected work" sizes="(max-width: 767px) 94vw, 16vw" />
          <span className="hero__last">
            <Letters word="Lekamge." />
            <span className="hero__mark">
              <Scribble kind="loop" />
            </span>
          </span>
        </span>
      </h1>

      <div className="hero__foot">
        <p className="hero__lead" data-hero-fade>
          I design products, write the code and read the data. Software engineer &amp; data scientist from{" "}
          {site.country}, founder of <a href="https://www.onebillionlabs.com/" target="_blank" rel="noopener">One Billion Labs</a>.
        </p>
        <p className="hero__role" aria-live="off">
          <span className="sr-only">Software Engineer, Data Scientist, Founder &amp; CEO, UI/UX Designer</span>
          <span className="role" ref={role} aria-hidden="true">
            <span className="role__layer">
              <span className="role__ln">Software</span>
              <span className="role__ln">Engineer</span>
            </span>
          </span>
        </p>
        <a className="hero__cue mono" href="#intro" data-hero-fade>
          <span>Scroll</span>
          <i aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
