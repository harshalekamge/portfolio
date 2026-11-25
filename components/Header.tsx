"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { usePathname } from "next/navigation";
import { nav, site, socials } from "@/content/site";
import { setupGsap, isStill } from "@/lib/motion";

function Clock() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: site.timeZone });
    const tick = () => setTime(f.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{time}</span>;
}

export function RollText({ children }: { children: string }) {
  return (
    <span className="roll" data-text={children}>
      <span>{children}</span>
    </span>
  );
}

const subscribeMotion = (cb: () => void) => {
  document.addEventListener("hl:motion", cb);
  return () => document.removeEventListener("hl:motion", cb);
};

function MotionSwitch() {
  // both switches (header + menu) read the same source: the `still` class on <html>
  const on = useSyncExternalStore(subscribeMotion, () => !isStill(), () => true);
  const toggle = () => {
    const next = !on;
    document.documentElement.classList.toggle("still", !next);
    try {
      localStorage.setItem("hl-motion", next ? "on" : "off");
    } catch {}
    document.dispatchEvent(new Event("hl:motion"));
  };
  return (
    <button className="motion-switch" type="button" role="switch" aria-checked={on} onClick={toggle}>
      <span className="motion-switch__label">Motion</span>
      <span className="motion-switch__track" aria-hidden="true">
        <i />
      </span>
    </button>
  );
}

export default function Header() {
  const path = usePathname();
  const bar = useRef<HTMLElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // hide while reading down, come back on the way up (and at the very top).
  // It only flips after a run of ~48px in one direction, so small wobbles at the end
  // of a trackpad fling don't make it flicker.
  useEffect(() => {
    const el = bar.current!;
    let last = scrollY;
    let run = 0;
    let hidden = false;
    const set = (h: boolean) => {
      if (h === hidden) return;
      hidden = h;
      el.classList.toggle("is-hidden", h);
    };
    const onScroll = () => {
      const y = scrollY;
      const d = y - last;
      last = y;
      if (y < el.offsetHeight * 1.5 || document.body.dataset.menu === "open") {
        run = 0;
        return set(false);
      }
      run = Math.sign(d) === Math.sign(run) ? run + d : d;
      if (run > 48) set(true);
      else if (run < -48) set(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("focusin", () => set(false));
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // menu sheet: columns grow down from the button's column, rows slide up after
  useEffect(() => {
    setupGsap();
    const s = sheet.current!;
    const cols = s.querySelectorAll(".sheet__cols i");
    const rows = s.querySelectorAll(".sheet__link > span");
    const meta = s.querySelectorAll(".sheet__meta > *");
    gsap.set(s, { autoAlpha: 0 });
    tl.current = gsap
      .timeline({ paused: true })
      .set(s, { autoAlpha: 1 })
      .fromTo(cols, { scaleY: 0 }, { scaleY: 1, duration: 0.6, stagger: { each: 0.03, from: "end" } }, 0)
      .fromTo(rows, { yPercent: 110 }, { yPercent: 0, duration: 0.7, stagger: 0.06 }, 0.25)
      .fromTo(meta, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 }, 0.45);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      tl.current?.kill();
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.dataset.menu = open ? "open" : "";
    const t = tl.current;
    if (!t) return;
    if (open) {
      window.__lenis?.stop();
      if (isStill()) t.progress(1);
      else t.timeScale(1).play();
    } else {
      window.__lenis?.start();
      if (isStill()) t.progress(0);
      else t.timeScale(1.6).reverse();
    }
  }, [open]);

  return (
    <>
      <header className="header" ref={bar}>
        <a className="header__brand" href="#top" aria-label="Harsha Lekamge, back to top">
          <span>Harsha</span>
          <span>Lekamge</span>
        </a>
        <p className="header__meta mono">
          <span>Based in {site.location}</span>
          <span>
            Local time <Clock /> (GMT+5:30)
          </span>
        </p>
        <p className="header__status mono">
          <i className="pulse" aria-hidden="true" />
          {site.available}
        </p>
        <nav className="header__nav" aria-label="Primary">
          <ul>
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} aria-current={n.href === path ? "page" : undefined}>
                  <RollText>{n.label}</RollText>
                </a>
              </li>
            ))}
          </ul>
          <MotionSwitch />
        </nav>
        <button
          className="header__menu"
          type="button"
          aria-expanded={open}
          aria-controls="menu-sheet"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="header__menu-label">
            <span>{open ? "Close" : "Menu"}</span>
          </span>
          <span className={`burger ${open ? "is-open" : ""}`} aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </header>

      <div className="sheet" id="menu-sheet" ref={sheet} aria-hidden={!open} inert={!open}>
        <div className="sheet__cols" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        <nav className="sheet__in" aria-label="Menu">
          {nav.map((n, i) => (
            <a
              key={n.href}
              className="sheet__link"
              href={n.href}
              aria-current={n.href === path ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              <span>
                <small className="mono">0{i + 1}</small>
                {n.label}
              </span>
            </a>
          ))}
          <div className="sheet__meta mono">
            {site.emails.map((e) => (
              <a key={e} href={`mailto:${e}`}>
                {e}
              </a>
            ))}
            {socials.slice(0, 3).map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label} ↗
              </a>
            ))}
            <MotionSwitch />
          </div>
        </nav>
      </div>
    </>
  );
}
