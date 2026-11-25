/** The top of a sub-page: label, a big title, then a lead with a few numbers and links. */
export default function PageIntro({
  num,
  label,
  title,
  lead,
  stats = [],
  links = [],
}: {
  num: string;
  label: string;
  title: string;
  lead: string;
  stats?: { n: string | number; label: string }[];
  links?: { href: string; label: string }[];
}) {
  return (
    <header className="pintro" id="top">
      <p className="label mono pintro__crumbs">
        <a href="/" className="pintro__home">
          ← Home
        </a>
        <span>({num})</span> {label}
      </p>
      <h1 className="pintro__title" data-reveal-lines>
        {title}
      </h1>
      <div className="pintro__foot">
        <p className="pintro__lead" data-reveal>
          {lead}
        </p>
        <div className="pintro__side" data-reveal>
          {stats.length > 0 && (
            <dl className="pintro__stats">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="mono">{s.label}</dt>
                  <dd>{typeof s.n === "number" ? String(s.n).padStart(2, "0") : s.n}</dd>
                </div>
              ))}
            </dl>
          )}
          {links.length > 0 && (
            <p className="pintro__links">
              {links.map((l) => (
                <a key={l.href} className="pill" href={l.href}>
                  <span className="roll" data-text={`${l.label} →`}>
                    <span>{l.label} →</span>
                  </span>
                </a>
              ))}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
