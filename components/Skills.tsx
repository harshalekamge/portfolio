"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { skills, type Project } from "@/content/site";
import { projectsFor, initials } from "@/lib/skillMap";
import { finePointer } from "@/lib/motion";

function Thumb({ p, big = false }: { p: Project; big?: boolean }) {
  return (
    <span className={`sk-thumb${big ? " sk-thumb--big" : ""}`} style={{ ["--tone" as string]: p.tone ?? "#141210" }} aria-hidden="true">
      {p.image ? (
        <Image src={p.image} alt="" fill sizes={big ? "160px" : "72px"} style={{ objectFit: "cover", objectPosition: "50% 0%" }} />
      ) : (
        <span className="sk-thumb__txt">{initials(p.title)}</span>
      )}
    </span>
  );
}

type Pop = { skill: string; x: number; y: number; flip: boolean };

/** Scroll to a project. Work cards are sticky, so measure where they sit in the flow, not where they're stuck. */
function goTo(slug: string) {
  const el = document.getElementById(`project-${slug}`);
  if (!el) return;
  const lenis = window.__lenis;
  if (el.classList.contains("card")) {
    const prev = el.style.position;
    el.style.position = "relative";
    const y = el.getBoundingClientRect().top + scrollY;
    el.style.position = prev;
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y });
    return;
  }
  el.querySelector("details")?.setAttribute("open", "");
  if (lenis) lenis.scrollTo(el, { offset: -90, duration: 1.4 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 90 });
}
const jump = (e: React.MouseEvent, slug: string, before: () => void) => {
  e.preventDefault();
  e.stopPropagation();
  before();
  setTimeout(() => goTo(slug), 60);
};

/**
 * Skills & technologies. Hover a skill to see up to three projects that use it;
 * click it (or "See all") to open a panel with every project that does.
 */
export default function Skills() {
  const [pop, setPop] = useState<Pop | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const hideT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const show = (e: React.PointerEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>, skill: string) => {
    if ("pointerType" in e && e.pointerType !== "mouse") return;
    if (!("pointerType" in e) && !finePointer()) return;
    clearTimeout(hideT.current);
    const r = e.currentTarget.getBoundingClientRect();
    const flip = r.left + 340 > innerWidth - 16;
    setPop({ skill, x: flip ? r.right : r.left, y: r.bottom + 8, flip });
  };
  const hideSoon = () => {
    clearTimeout(hideT.current);
    hideT.current = setTimeout(() => setPop(null), 180);
  };
  const keep = () => clearTimeout(hideT.current);

  const openPanel = useCallback((skill: string, from?: HTMLElement | null) => {
    if (from) lastTrigger.current = from;
    setPop(null);
    setOpen(skill);
  }, []);
  const close = useCallback(() => {
    setOpen(null);
    lastTrigger.current?.focus({ preventScroll: true });
  }, []);

  // panel: stop the smooth scroller underneath, close on Escape, focus the close button
  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    document.documentElement.classList.add("panel-open");
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      window.__lenis?.start();
      document.documentElement.classList.remove("panel-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // a popover should not hang around when the page scrolls away under it
  useEffect(() => {
    if (!pop) return;
    const off = () => setPop(null);
    window.addEventListener("scroll", off, { passive: true, once: true });
    return () => window.removeEventListener("scroll", off);
  }, [pop]);

  // the hover card and panel live on <body>, above the header (main is its own stacking context)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const popList = pop ? projectsFor(pop.skill) : [];
  const panelList = open ? projectsFor(open) : [];

  return (
    <section className="skills" id="skills" aria-labelledby="skills-title">
      <div className="section-head">
        <p className="label mono">
          <span>(06)</span> Toolkit
        </p>
        <h2 className="section-title" id="skills-title" data-reveal-lines>
          Skills &amp; technologies
        </h2>
        <p className="skills__hint mono">Hover a skill to see where I&apos;ve used it. Click for every project.</p>
      </div>
      <div className="skills__grid" data-reveal-rule>
        {skills.map((g) => (
          <div key={g.group} className="skills__group">
            <h3 className="mono skills__label">{g.group}</h3>
            <ul>
              {g.items.map((s) => {
                const n = projectsFor(s).length;
                return (
                  <li key={s}>
                    <button
                      type="button"
                      className={`skill${n ? "" : " skill--quiet"}`}
                      onPointerEnter={(e) => show(e, s)}
                      onPointerLeave={hideSoon}
                      onFocus={(e) => show(e, s)}
                      onBlur={hideSoon}
                      onClick={(e) => openPanel(s, e.currentTarget)}
                      aria-haspopup="dialog"
                      aria-label={`${s}: ${n ? `${n} project${n > 1 ? "s" : ""}` : "no public projects yet"}`}
                    >
                      <span className="skill__name">{s}</span>
                      {n > 0 && <sup className="skill__n mono">{n}</sup>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* hover card: the top three */}
      {mounted && pop && createPortal(
        <div
          className={`sk-pop${pop.flip ? " sk-pop--flip" : ""}`}
          style={{ left: pop.x, top: pop.y }}
          onPointerEnter={keep}
          onPointerLeave={hideSoon}
          role="tooltip"
        >
          <p className="sk-pop__head mono">
            <span>{pop.skill}</span>
            <span>{popList.length ? `${popList.length} project${popList.length > 1 ? "s" : ""}` : "Toolkit"}</span>
          </p>
          {popList.length ? (
            <>
              <ul className="sk-pop__list">
                {popList.slice(0, 3).map((p) => (
                  <li key={p.slug}>
                    <a href={`#project-${p.slug}`} onClick={(e) => jump(e, p.slug, () => setPop(null))}>
                      <Thumb p={p} />
                      <span>
                        <b>{p.title}</b>
                        <small className="mono">
                          {p.kind} · {p.year}
                        </small>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <button type="button" className="sk-pop__all mono" onClick={() => openPanel(pop.skill)}>
                {popList.length > 3 ? `See all ${popList.length} projects →` : "Open details →"}
              </button>
            </>
          ) : (
            <p className="sk-pop__empty">Part of my toolkit. No public project to show for it yet.</p>
          )}
        </div>,
        document.body,
      )}

      {/* panel: every project for the skill */}
      {mounted && createPortal(
      <div className={`sk-panel${open ? " is-open" : ""}`} aria-hidden={!open} inert={!open}>
        <button className="sk-panel__scrim" type="button" tabIndex={-1} aria-label="Close" onClick={close} />
        <div className="sk-panel__sheet" role="dialog" aria-modal="true" aria-labelledby="sk-panel-title" data-lenis-prevent>
          <header className="sk-panel__top">
            <p className="mono">Projects using</p>
            <button ref={closeBtn} className="pill" type="button" onClick={close}>
              <span className="roll" data-text="Close ✕">
                <span>Close ✕</span>
              </span>
            </button>
          </header>
          <h3 className="sk-panel__title" id="sk-panel-title">
            {open}
          </h3>
          <p className="sk-panel__count mono">
            {panelList.length
              ? `${panelList.length} project${panelList.length > 1 ? "s" : ""}`
              : "No public project to show for this one yet"}
          </p>
          <ol className="sk-panel__list">
            {panelList.map((p) => (
              <li key={p.slug} className="sk-card">
                <Thumb p={p} big />
                <div className="sk-card__body">
                  <p className="sk-card__kind mono">
                    {p.kind} · {p.year}
                  </p>
                  <h4 className="sk-card__title">{p.title}</h4>
                  <p className="sk-card__desc">{p.description}</p>
                  <p className="sk-card__tech">
                    {p.tech.map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`mono${t === open ? " is-on" : ""}`}
                        onClick={() => setOpen(t)}
                        title={`Projects using ${t}`}
                      >
                        {t}
                      </button>
                    ))}
                  </p>
                  <p className="sk-card__links">
                    <a className="pill" href={`#project-${p.slug}`} onClick={(e) => jump(e, p.slug, () => setOpen(null))}>
                      <span className="roll" data-text="Jump to project ↓">
                        <span>Jump to project ↓</span>
                      </span>
                    </a>
                    {p.links.map((l) => (
                      <a key={l.href} className="pill" href={l.href} target="_blank" rel="noopener">
                        <span className="roll" data-text={`${l.label} ↗`}>
                          <span>{l.label} ↗</span>
                        </span>
                      </a>
                    ))}
                    {!p.links.length && p.note && <span className="mono sk-card__note">{p.note}</span>}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>,
        document.body,
      )}
    </section>
  );
}
