"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { heroShots, roles, site, type HeroShot } from "@/content/site";
import { setupGsap, isStill, finePointer, afterIntro } from "@/lib/motion";
import { createSwapper, liftLetters } from "@/lib/swapTitle";
import Scribble from "./Scribble";


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

function Slot({ items, className, label, sizes }: { items: HeroShot[]; className: string; label: string; sizes: string }) {
  return (
    <a className={`hero__slot ${className}`} href="#work" data-slot aria-label={label} data-cursor>
      {items.map((p, i) => (
        <span className="hero__ph" key={p.src} style={{ zIndex: i === 0 ? 2 : 0, ["--tone" as string]: p.tone }}>
          <Image
            src={p.src}
            alt={i === 0 ? p.alt : ""}
            fill
            sizes={sizes}
            priority={i === 0}
            style={{ objectFit: "contain" }}
          />
        </span>
      ))}
    </a>
  );
}

const HOLD = [4200, 2600, 3200, 2600];

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
    const swap = createSwapper(role.current!, roles, HOLD, { introDelay: 450 });
    const stop = afterIntro(() => swap.start());
    const unlift = finePointer() ? liftLetters(root.current!, ".hero__ch, .role__ch", 0.9) : () => {};
    return () => {
      stop();
      swap.destroy();
      unlift();
    };
  }, []);

  return (
    <section className="hero" id="top" ref={root} aria-labelledby="hero-title">
      <h1 className="hero__title" id="hero-title" aria-label="Harsha Lekamge">
        <span className="hero__line">
          <Letters word="Harsha" />
          <Slot items={heroShots.a} className="hero__slot--a" label="See selected work" sizes="(max-width: 767px) 40vw, 18vw" />
        </span>
        <span className="hero__line hero__line--indent">
          <Slot items={heroShots.b} className="hero__slot--b" label="See selected work" sizes="(max-width: 767px) 94vw, 16vw" />
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
