import { site, socials, projects, experience } from "@/content/site";

/** Structured data for Google: who Harsha is, the site, the page and the work on it. */
export function jsonLd() {
  const person = {
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: site.name,
    alternateName: ["Harsha", "harshalekamge"],
    givenName: "Harsha",
    familyName: "Lekamge",
    url: `${site.url}/`,
    image: `${site.url}${site.portrait}`,
    email: site.emails.map((e) => `mailto:${e}`),
    telephone: site.phone,
    jobTitle: "Software Engineer & Data Scientist",
    description: site.description,
    nationality: { "@type": "Country", name: "Sri Lanka" },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: site.countryCode,
    },
    homeLocation: { "@type": "Place", name: site.location },
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "Sri Lanka Institute of Information Technology",
      alternateName: "SLIIT",
      url: "https://www.sliit.lk/",
    },
    sameAs: socials.filter((s) => s.label !== "WhatsApp").map((s) => s.href),
    worksFor: experience
      .filter((e) => !e.end)
      .map((e) => ({ "@type": "Organization", name: e.org, ...(e.orgUrl ? { url: e.orgUrl } : {}) })),
    knowsAbout: [
      "Software Engineering",
      "Full-stack Web Development",
      "Data Science",
      "Machine Learning",
      "UI/UX Design",
      "React",
      "Next.js",
      "TypeScript",
      "Python",
      "Java",
      "SQL",
      "Search Engine Optimization",
    ],
    hasOccupation: experience.map((e) => ({
      "@type": "Role",
      roleName: e.role,
      ...(e.start ? { startDate: e.start } : {}),
      ...(e.end ? { endDate: e.end } : {}),
      hasOccupation: { "@type": "Occupation", name: e.role },
    })),
  };

  const orgs = [
    {
      "@type": "Organization",
      "@id": "https://www.onebillionlabs.com/#org",
      name: "One Billion Labs",
      alternateName: "1B Labs",
      url: "https://www.onebillionlabs.com/",
      founder: { "@id": `${site.url}/#person` },
      address: { "@type": "PostalAddress", addressLocality: "Colombo", addressCountry: "LK" },
    },
    {
      "@type": "Organization",
      "@id": "https://quintolink.com/#org",
      name: "Quintolink",
      url: "https://quintolink.com/",
      founder: { "@id": `${site.url}/#person` },
    },
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: `${site.url}/`,
        name: site.name,
        alternateName: [`${site.name} Portfolio`, "Harsha Lekamge — Portfolio"],
        description: site.description,
        inLanguage: "en",
        publisher: { "@id": `${site.url}/#person` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${site.url}/#webpage`,
        url: `${site.url}/`,
        name: site.title,
        isPartOf: { "@id": `${site.url}/#website` },
        about: { "@id": `${site.url}/#person` },
        mainEntity: { "@id": `${site.url}/#person` },
        primaryImageOfPage: { "@type": "ImageObject", url: `${site.url}${site.portrait}` },
        inLanguage: "en",
        dateModified: new Date().toISOString().slice(0, 10),
      },
      person,
      ...orgs,
      {
        "@type": "ItemList",
        "@id": `${site.url}/#work`,
        name: "Projects",
        itemListElement: projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "CreativeWork",
            name: p.title,
            description: p.description,
            ...(p.image ? { image: `${site.url}${p.image}` } : {}),
            url: p.links[0]?.href ?? `${site.url}/#project-${p.slug}`,
            dateCreated: p.year,
            creator: { "@id": `${site.url}/#person` },
            keywords: p.tech.join(", "),
            genre: p.kind,
          },
        })),
      },
    ],
  };
}
