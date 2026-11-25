"use client";

import { useState } from "react";
import { projects, type Project } from "@/content/site";
import { initials } from "@/lib/skillMap";

const FILTERS: { key: "all" | Project["group"]; label: string }[] = [
  { key: "all", label: "All" },
  { key: "engineering", label: "Engineering & research" },
  { key: "collab", label: "Collaborations" },
];
const groupLabel = { engineering: "Engineering & research", collab: "Collaboration", featured: "Featured" } as const;

/** /projects: roomy cards with a filter, instead of a dense list. */
export default function ProjectGrid() {
  const list = projects.filter((p) => p.group !== "featured");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const count = (k: string) => (k === "all" ? list.length : list.filter((p) => p.group === k).length);

  return (
    <section className="pgrid" aria-label="Projects">
      <div className="pgrid__filters" role="tablist" aria-label="Filter projects">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            role="tab"
            aria-selected={filter === f.key}
            className={`pgrid__filter${filter === f.key ? " is-on" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            <sup className="mono">{String(count(f.key)).padStart(2, "0")}</sup>
          </button>
        ))}
      </div>

      <ol className="pgrid__list">
        {list.map((p, i) => (
          <li
            key={p.slug}
            id={`project-${p.slug}`}
            className={`pcard${filter === "all" || filter === p.group ? "" : " is-hidden"}`}
            style={{ ["--tone" as string]: p.tone ?? "#141210" }}
            data-reveal
          >
            <article aria-labelledby={`pt-${p.slug}`}>
              <div className="pcard__cover" aria-hidden="true">
                <span className="pcard__num mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="pcard__group mono">{groupLabel[p.group]}</span>
                <span className="pcard__mark">{initials(p.title)}</span>
                <span className="pcard__words mono">
                  {p.tech.slice(0, 5).map((t) => (
                    <i key={t}>{t}</i>
                  ))}
                </span>
              </div>
              <div className="pcard__body">
                <p className="pcard__kind mono">
                  {p.kind} · {p.year}
                </p>
                <h2 className="pcard__title" id={`pt-${p.slug}`}>
                  {p.title}
                </h2>
                <p className="pcard__line">{p.line}</p>
                <p className="pcard__desc">{p.description}</p>
                <ul className="pcard__tech" aria-label="Built with">
                  {p.tech.map((t) => (
                    <li key={t}>
                      <a className="mono" href={`/skills#skill-${encodeURIComponent(t)}`}>
                        {t}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="pcard__foot">
                  {p.note && <span className="mono pcard__note">{p.note}</span>}
                  {p.links.map((l) => (
                    <a key={l.href} className="pill" href={l.href} target="_blank" rel="noopener">
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
    </section>
  );
}
