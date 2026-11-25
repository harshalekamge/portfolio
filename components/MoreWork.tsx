import { projects, skills } from "@/content/site";

/** After the featured stack: two big rows that lead to the full project index and the skills page. */
export default function MoreWork() {
  const more = projects.filter((p) => p.group !== "featured");
  const skillCount = skills.reduce((n, g) => n + g.items.length, 0);
  const rows = [
    {
      href: "/projects",
      title: "More projects",
      sub: "Engineering, research & collaborations",
      count: more.length,
      names: more.slice(0, 4).map((p) => p.title),
    },
    {
      href: "/skills",
      title: "Skills & technologies",
      sub: "Hover any tool to see where I've used it",
      count: skillCount,
      names: ["Spring Boot", "React", "YOLO", "PostgreSQL"],
    },
  ];
  return (
    <nav className="more" aria-label="More work">
      <ul data-reveal-rule>
        {rows.map((r) => (
          <li key={r.href}>
            <a className="more__row" href={r.href}>
              <span className="more__count mono">{String(r.count).padStart(2, "0")}</span>
              <span className="more__main">
                <span className="more__title">{r.title}</span>
                <span className="more__sub mono">{r.sub}</span>
              </span>
              <span className="more__names" aria-hidden="true">
                {r.names.map((n) => (
                  <i key={n}>{n}</i>
                ))}
                <i>…</i>
              </span>
              <span className="more__arrow" aria-hidden="true">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
