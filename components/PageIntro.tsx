/** The top of a sub-page: number, label, a big title and a short lead. */
export default function PageIntro({
  num,
  label,
  title,
  lead,
  aside,
}: {
  num: string;
  label: string;
  title: string;
  lead: string;
  aside?: React.ReactNode;
}) {
  return (
    <header className="pintro" id="top">
      <p className="label mono">
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
        {aside && (
          <div className="pintro__aside" data-reveal>
            {aside}
          </div>
        )}
      </div>
    </header>
  );
}
