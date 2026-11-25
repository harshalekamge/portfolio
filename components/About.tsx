"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { about, site, socials } from "@/content/site";
import { setupGsap, isStill, clamp, smooth } from "@/lib/motion";
import Scribble from "./Scribble";

/** About: the two halves of the hello slide together as you scroll in; the photo develops in slices. */
export default function About() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    setupGsap();
    const el = root.current!;
    const hello = el.querySelector<HTMLElement>(".about__hello")!;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (isStill()) return hello.style.setProperty("--s", "0");
      const r = el.getBoundingClientRect();
      const t = clamp((innerHeight - r.top) / (innerHeight + r.height * 0.35));
      hello.style.setProperty("--s", (1 - smooth(0, 0.6, t)).toFixed(4));
    };
    const queue = () => raf || (raf = requestAnimationFrame(update));
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    document.addEventListener("hl:motion", queue);
    update();

    const slices = el.querySelectorAll(".about__slices i");
    const ctx = gsap.context(() => {
      if (isStill()) return gsap.set(slices, { scaleY: 0 });
      gsap.fromTo(
        slices,
        { scaleY: 1 },
        {
          scaleY: 0,
          transformOrigin: "50% 0%",
          duration: 1,
          stagger: 0.07,
          scrollTrigger: { trigger: el.querySelector(".about__photo"), start: "top 75%", once: true },
        },
      );
    }, el);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      document.removeEventListener("hl:motion", queue);
      ctx.revert();
    };
  }, []);

  const linkedin = socials.find((s) => s.label === "LinkedIn")!;
  const github = socials.find((s) => s.label === "GitHub")!;

  return (
    <section className="about tone-dark" id="about" ref={root} aria-labelledby="about-title">
      <p className="label mono">
        <span>(04)</span> About
      </p>
      <h2 className="sr-only" id="about-title">
        {about.hello[0]} {about.hello[1]}
      </h2>
      <div className="about__hello">
        <span className="about__hi" aria-hidden="true">
          {about.hello[0]}
        </span>
        <figure className="about__photo">
          <Image
            src={site.portrait}
            alt="Portrait of Harsha Lekamge, smiling and reading a magazine in a library"
            width={1200}
            height={1500}
            sizes="(max-width: 767px) 60vw, 26vw"
          />
          <span className="about__slices" aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => (
              <i key={i} />
            ))}
          </span>
        </figure>
        <span className="about__name" aria-hidden="true">
          {about.hello[1]}
        </span>
      </div>
      <p className="about__caption hand">
        <Scribble kind="arrow" className="about__arrow" />
        {about.caption}
      </p>

      <div className="about__grid">
        <div className="about__body">
          {about.body.map((p) => (
            <p key={p.slice(0, 20)} data-reveal>
              {p}
            </p>
          ))}
        </div>
        <div className="about__side">
          <dl className="about__facts" data-reveal-rule>
            {about.facts.map(([k, v]) => (
              <div key={k}>
                <dt className="mono">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="about__aside" data-reveal>
            {about.aside}
          </p>
          <p className="about__actions" data-reveal>
            <a className="pill pill--light" href={`mailto:${site.email}`}>
              <span className="roll" data-text="Email ↗">
                <span>Email ↗</span>
              </span>
            </a>
            <a className="pill pill--light" href={linkedin.href} target="_blank" rel="noopener noreferrer">
              <span className="roll" data-text="LinkedIn ↗">
                <span>LinkedIn ↗</span>
              </span>
            </a>
            <a className="pill pill--light" href={github.href} target="_blank" rel="noopener noreferrer">
              <span className="roll" data-text="GitHub ↗">
                <span>GitHub ↗</span>
              </span>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
