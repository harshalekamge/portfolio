import Image from "next/image";
import { projects, type Project } from "@/content/site";

const groups: { key: Project["group"]; title: string; blurb: string }[] = [
  {
    key: "engineering",
    title: "Engineering & research",
    blurb: "Back-ends, data models and systems built for real users, where the work is in the code more than the pixels.",
  },
  {
    key: "collab",
    title: "Collaborations",
    blurb: "Team projects with classmates and friends.",
  },
];

/** The rest of the work, as an index: one row per project, open a row for the full story. */
export default function ProjectIndex() {
  const numbered = new Map(projects.filter((p) => p.group !== "featured").map((p, i) => [p.slug, i + 1]));
  return (
    <div className="pindex">
      {groups.map((g) => {
        const list = projects.filter((p) => p.group === g.key);
        return (
          <section key={g.key} className="pindex__group" aria-labelledby={`pindex-${g.key}`}>
            <header className="pindex__head">
              <h2 id={`pindex-${g.key}`} className="pindex__title">
                {g.title}
              </h2>
              <p className="pindex__blurb">{g.blurb}</p>
            </header>
            <ol className="pindex__list" data-reveal-rule>
              {list.map((p) => {
                const n = numbered.get(p.slug)!;
                return (
                  <li key={p.slug} id={`project-${p.slug}`} className="prow">
                    <details>
                      <summary>
                        <span className="prow__num mono">{String(n).padStart(2, "0")}</span>
                        <span className="prow__main">
                          <span className="prow__name">{p.title}</span>
                          <span className="prow__line">{p.line}</span>
                        </span>
                        <span className="prow__tech" aria-label="Built with">
                          {p.tech.map((t) => (
                            <i key={t} className="mono">
                              {t}
                            </i>
                          ))}
                        </span>
                        <span className="prow__meta mono">
                          {p.kind}
                          <br />
                          {p.year}
                        </span>
                        <span className="prow__plus" aria-hidden="true" />
                      </summary>
                      <div className="prow__body">
                        <p>{p.description}</p>
                        <p className="prow__links">
                          {p.note && <span className="mono prow__note">{p.note}</span>}
                          {p.links.map((l) => (
                            <a key={l.href} className="pill" href={l.href} target="_blank" rel="noopener">
                              <span className="roll" data-text={`${l.label} ↗`}>
                                <span>{l.label} ↗</span>
                              </span>
                            </a>
                          ))}
                        </p>
                        {p.image && (
                          <figure className="prow__shot" style={{ ["--tone" as string]: p.tone ?? "#141210" }}>
                            <Image
                              src={p.image}
                              alt={p.imageAlt ?? `${p.title} screenshot`}
                              width={p.width ?? 1600}
                              height={p.height ?? 1000}
                              sizes="(max-width: 760px) 92vw, 58vw"
                            />
                          </figure>
                        )}
                      </div>
                    </details>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
