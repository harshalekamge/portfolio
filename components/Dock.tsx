"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { projects, skills } from "@/content/site";

const nProjects = projects.filter((p) => p.group !== "featured").length;
const nSkills = skills.reduce((n, g) => n + g.items.length, 0);

/**
 * Two floating buttons. On the home page: Projects and Skills. On those pages: back home
 * (to the exact spot you left) and the other page.
 */
export default function Dock() {
  const path = usePathname();
  const home = path === "/";
  const [show, setShow] = useState(false);
  const footerSeen = useRef(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      // home: after the hero. Sub-pages: once you scroll past the intro, so it never covers its links
      const past = home ? scrollY > innerHeight * 0.8 : scrollY > innerHeight * 0.6;
      setShow(past && !footerSeen.current);
    };
    const queue = () => raf || (raf = requestAnimationFrame(update));
    // step aside when the contact form is on screen, so the dock never covers it
    const io = new IntersectionObserver(
      ([e]) => {
        footerSeen.current = e.isIntersecting;
        queue();
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    const f = document.querySelector(".footer__grid");
    if (f) io.observe(f);
    window.addEventListener("scroll", queue, { passive: true });
    update();
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
    };
  }, [home]);

  const items = home
    ? [
        { href: "/projects", label: "Projects", n: nProjects },
        { href: "/skills", label: "Skills", n: nSkills },
      ]
    : [
        { href: "/", label: "← Home", n: null, back: true },
        path === "/projects" ? { href: "/skills", label: "Skills", n: nSkills } : { href: "/projects", label: "Projects", n: nProjects },
      ];

  return (
    <nav className={`dock${show ? " is-on" : ""}`} aria-label="Quick links">
      {items.map((it) => (
        <a key={it.href} href={it.href} className={`dock__btn${"back" in it ? " dock__btn--back" : ""}`} data-cursor>
          <span className="roll" data-text={it.label}>
            <span>{it.label}</span>
          </span>
          {it.n !== null && <sup className="dock__n">{it.n}</sup>}
          {!("back" in it) && (
            <span className="dock__arrow" aria-hidden="true">
              ↗
            </span>
          )}
        </a>
      ))}
    </nav>
  );
}
