import { experience } from "@/content/site";
import Scribble from "./Scribble";

export function Experience() {
  return (
    <section className="exp" id="experience" aria-labelledby="exp-title">
      <div className="section-head">
        <p className="label mono">
          <span>(05)</span> Experience
        </p>
        <h2 className="section-title" id="exp-title" data-reveal-lines>
          Where I&apos;ve been building
        </h2>
      </div>
      <ol className="exp__list" data-reveal-rule>
        {experience.map((e) => (
          <li key={e.org + e.role} className="exp__row">
            <p className="exp__period mono">{e.period}</p>
            <div className="exp__main">
              <h3 className="exp__role">
                <span className="exp__role-text">
                  {e.role}
                  <Scribble kind="underline" className="exp__ink" />
                </span>
              </h3>
              <p className="exp__org">
                {e.orgUrl ? (
                  <a href={e.orgUrl} target="_blank" rel="noopener">
                    {e.org} ↗
                  </a>
                ) : (
                  e.org
                )}
              </p>
            </div>
            <p className="exp__summary">{e.summary}</p>
            <p className="exp__place mono">{e.place}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
