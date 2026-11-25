"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { projects } from "@/content/site";
import { setupGsap, isStill, finePointer, Spring } from "@/lib/motion";

/** Selected work: a list of big cards that wipe open as they arrive, with a tag that follows the cursor. */
export default function Work() {
  const root = useRef<HTMLElement>(null);
  const tag = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setupGsap();
    const el = root.current!;
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-card]"));
    const ctx = gsap.context(() => {
      if (isStill()) return;
      cards.forEach((card) => {
        const frame = card.querySelector(".card__media");
        const art = card.querySelector(".card__shot");
        const text = card.querySelectorAll(".card__title, .card__line, .card__meta > *");
        gsap.set(frame, { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(art, { scale: 1.12 });
        gsap.set(text, { yPercent: 60, opacity: 0 });
        gsap
          .timeline({ scrollTrigger: { trigger: card, start: "top 82%", once: true } })
          .to(frame, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, clearProps: "clipPath" }, 0)
          .to(art, { scale: 1, duration: 1.4 }, 0)
          .to(text, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.05 }, 0.1);
        // the screenshot drifts a little inside its frame
        gsap.fromTo(
          card.querySelector(".card__float"),
          { yPercent: 5 },
          { yPercent: -5, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // hover tag: springs after the cursor, flips to stay on screen
  useEffect(() => {
    if (!finePointer()) return;
    const t = tag.current!;
    const label = t.querySelector("span")!;
    const x = new Spring(0, 0.35);
    const y = new Spring(0, 0.35);
    const s = new Spring(0, 0.3, 0.15);
    let raf = 0;
    let last = 0;
    let cur: HTMLElement | null = null;
    let px = 0;
    let py = 0;
    const render = () => {
      t.style.transform = `translate3d(${x.v.toFixed(1)}px, ${y.v.toFixed(1)}px, 0) scale(${Math.max(0, s.v).toFixed(3)})`;
      t.style.opacity = s.v > 0.02 ? "1" : "0";
    };
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      [x, y, s].forEach((sp) => sp.step(dt));
      render();
      raf = x.still(0.3) && y.still(0.3) && s.still(0.002) ? 0 : requestAnimationFrame(loop);
    };
    const kick = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const place = () => {
      const w = t.offsetWidth;
      const h = t.offsetHeight;
      x.t = px + 18 + w > innerWidth - 8 ? px - 18 - w : px + 18;
      y.t = py + 18 + h > innerHeight - 8 ? py - 18 - h : py + 18;
    };
    let seen = false;
    const update = (target: Element | null) => {
      const hit = target?.closest?.<HTMLElement>("[data-hover]") ?? null;
      if (hit !== cur) {
        cur = hit;
        if (hit) {
          label.textContent = hit.dataset.hover!;
          t.style.setProperty("--tone", hit.dataset.tone ?? "");
          if (s.v < 0.05) {
            place();
            x.set(x.t);
            y.set(y.t);
          }
          s.t = 1;
        } else s.t = 0;
      }
      place();
      if (isStill()) {
        [x, y, s].forEach((sp) => sp.set(sp.t));
        render();
      } else kick();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      seen = true;
      update(e.target as Element);
    };
    // the page can scroll a card out from under a still cursor: check again
    let sraf = 0;
    const onScroll = () => {
      if (!seen || sraf) return;
      sraf = requestAnimationFrame(() => {
        sraf = 0;
        update(document.elementFromPoint(px, py));
      });
    };
    const onLeave = () => update(null);
    document.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(sraf);
      document.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section className="work" id="work" ref={root} aria-labelledby="work-title">
      <div className="work__head">
        <p className="label mono">
          <span>(03)</span> Selected work
        </p>
        <h2 className="work__title" id="work-title" data-reveal-lines>
          A few things I&apos;ve built
        </h2>
        <p className="work__count mono" aria-hidden="true">
          {String(projects.length).padStart(2, "0")} projects
        </p>
      </div>

      <ol className="work__list">
        {projects.map((p, i) => (
          <li key={p.slug} className="card" data-card>
            <article aria-labelledby={`p-${p.slug}`}>
              <header className="card__head">
                <h3 className="card__title" id={`p-${p.slug}`}>
                  <span className="mono card__num">0{i + 1}</span>
                  {p.title}
                </h3>
                <p className="card__line">{p.line}</p>
              </header>
              <a
                className="card__media"
                href={p.links[0].href}
                target="_blank"
                rel="noopener"
                data-hover={`${p.links[0].label} ↗`}
                data-tone={p.tone}
                style={{ ["--tone" as string]: p.tone }}
                aria-label={`${p.title}: open ${p.links[0].label.toLowerCase()} (new tab)`}
              >
                <span className="card__shot">
                  <span className="card__float">
                    <span className="card__browser" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                    <Image
                      src={p.image}
                      alt={p.imageAlt}
                      width={p.width}
                      height={p.height}
                      sizes="(max-width: 767px) 92vw, 70vw"
                      className="card__img"
                    />
                  </span>
                </span>
              </a>
              <div className="card__meta">
                <p className="mono">
                  {p.kind} · {p.year}
                </p>
                <p className="card__desc">{p.description}</p>
                <ul className="card__tags" aria-label="Built with">
                  {p.tags.map((t) => (
                    <li key={t} className="mono">
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="card__links">
                  {p.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener" className="pill">
                      <span className="roll" data-text={`${l.label} ↗`}>
                        <span>{l.label} ↗</span>
                      </span>
                    </a>
                  ))}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ol>
      <div className="hover-tag" ref={tag} aria-hidden="true">
        <span>View</span>
      </div>
    </section>
  );
}
