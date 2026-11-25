/**
 * Everything the site says lives here. Edit this file to update the portfolio:
 * projects, experience, skills, links and SEO text all come from these objects.
 */

export const site = {
  url: "https://portfolio.harshalekamge.com",
  name: "Harsha Lekamge",
  shortName: "Harsha",
  initials: "HL",
  title: "Harsha Lekamge — Software Engineer & Data Scientist, Sri Lanka",
  description:
    "Harsha Lekamge is a software engineer and data scientist from Sri Lanka, founder & CEO of One Billion Labs and co-founder of Quintolink. Web apps, data science and UI/UX, designed and built end to end.",
  keywords: [
    "Harsha Lekamge",
    "Software Engineer Sri Lanka",
    "Data Scientist Sri Lanka",
    "Full Stack Developer Sri Lanka",
    "Web Developer Sri Lanka",
    "React Developer",
    "Next.js Developer",
    "UI UX Designer Sri Lanka",
    "One Billion Labs",
    "Quintolink",
    "Freelance Web Developer Colombo",
    "Portfolio",
  ],
  locale: "en_US",
  location: "Malabe, Sri Lanka",
  city: "Malabe",
  region: "Western Province",
  country: "Sri Lanka",
  countryCode: "LK",
  timeZone: "Asia/Colombo",
  email: "contact@harshalekamge.com",
  altEmail: "lekamge.h2024@gmail.com",
  phone: "+94 77 875 3792",
  phoneHref: "tel:+94778753792",
  whatsapp: "https://wa.me/94778753792",
  googleVerification: "xQaXn9ZHVScxNokxcgRYuEu-PzMcJaoYdAM1wpC6JZA",
  portrait: "/images/harsha-lekamge.webp",
  available: "Open to work & collaborations",
};

export const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/harsha-lekamge/", handle: "in/harsha-lekamge" },
  { label: "GitHub", href: "https://github.com/harshalekamge", handle: "@harshalekamge" },
  { label: "Instagram", href: "https://www.instagram.com/harsha_lekamge", handle: "@harsha_lekamge" },
  { label: "WhatsApp", href: "https://wa.me/94778753792", handle: "+94 77 875 3792" },
  { label: "Facebook", href: "https://www.facebook.com/harsha.lekamgeiii.1", handle: "Harsha Lekamge" },
];

/** The roles that rotate under the hero title. */
export const roles: [string, string][] = [
  ["Software", "Engineer"],
  ["Data", "Scientist"],
  ["Founder", "& CEO"],
  ["UI / UX", "Designer"],
];

/** Pinned intro statement: words fill in as you scroll. Wrap a phrase in *stars* to mark it. */
export const statement =
  "I build software people actually use. Web apps, data pipelines and machine-learning models, designed in *Figma* and shipped in *code*. I run *One Billion Labs*, co-founded *Quintolink*, and I care about the details users never notice, until they're missing.";

export type Project = {
  slug: string;
  title: string;
  kind: string;
  year: string;
  line: string;
  description: string;
  image: string;
  imageAlt: string;
  width: number;
  height: number;
  tone: string;
  tags: string[];
  links: { label: string; href: string }[];
};

/** Projects from the live portfolio. */
export const projects: Project[] = [
  {
    slug: "saloon-velora",
    title: "Saloon Velora",
    kind: "Website · AI",
    year: "2026",
    line: "A salon site with real-time 3D and an AI beauty assistant.",
    description:
      "A premium, AI-powered salon website developed with React 19 and TypeScript. It combines luxury design, real-time 3D visuals and an intelligent AI beauty assistant to create an immersive, modern and responsive brand experience.",
    image: "/images/work/saloon-velora.webp",
    imageAlt: "Saloon Velora website homepage with the headline 'Your Beauty Redefined'",
    width: 1813,
    height: 850,
    tone: "#7a2335",
    tags: ["React 19", "TypeScript", "Firebase", "3D", "AI assistant"],
    links: [{ label: "Live site", href: "https://testsaloonvelora.web.app/" }],
  },
  {
    slug: "saloon-ceylonima",
    title: "Saloon Ceylonima",
    kind: "Website · Brand",
    year: "2026",
    line: "A luxury salon that wanted its website to feel like the chair.",
    description:
      "A luxury salon website built with React and TypeScript, with refined visuals, elegant typography and smooth interactions. Designed with Tailwind CSS and responsive layouts for a polished, high-end experience on every device.",
    image: "/images/work/saloon-ceylonima.webp",
    imageAlt: "Saloon Ceylonima website homepage with the headline 'Crafting Beauty with Passion & Precision'",
    width: 1626,
    height: 810,
    tone: "#6b1f2a",
    tags: ["React", "TypeScript", "Tailwind CSS", "Firebase", "Brand identity"],
    links: [{ label: "Live site", href: "https://testsaloonceylonima.web.app/" }],
  },
  {
    slug: "sales-shoe-mart",
    title: "Sales Shoe Mart",
    kind: "Mobile app UI",
    year: "2025",
    line: "A shoe store app laid out on the golden ratio.",
    description:
      "A visually balanced Figma mobile UI for a shoe retailer, with golden-ratio layouts, smooth transitions, custom branding and high-quality product visuals tuned for modern phones.",
    image: "/images/work/sales-shoe-mart-screens.webp",
    imageAlt: "Sales Shoe Mart mobile app onboarding screens designed in Figma",
    width: 1180,
    height: 538,
    tone: "#1c1917",
    tags: ["Figma", "UI design", "Prototyping", "Golden ratio"],
    links: [
      { label: "Prototype", href: "https://www.figma.com/proto/vplOGgFsPXLNrstrGGs4gL/MAD_lab_test_01" },
      { label: "Figma file", href: "https://www.figma.com/design/vplOGgFsPXLNrstrGGs4gL/MAD_lab_test_01" },
    ],
  },
];

export type Experience = {
  role: string;
  org: string;
  orgUrl?: string;
  period: string;
  start?: string; // ISO-ish, used for structured data
  end?: string;
  place: string;
  summary: string;
};

export const experience: Experience[] = [
  {
    role: "Founder & CEO",
    org: "One Billion Labs",
    orgUrl: "https://www.onebillionlabs.com/",
    period: "Present",
    place: "Colombo, Sri Lanka",
    summary:
      "Running a software studio that designs and builds websites, web apps and brand experiences for businesses in Sri Lanka and beyond.",
  },
  {
    role: "Co-founder",
    org: "Quintolink",
    orgUrl: "https://quintolink.com/",
    period: "2026 — Present",
    start: "2026",
    place: "Sri Lanka",
    summary:
      "Co-founding a startup focused on web development, design, custom software, web apps and mobile apps.",
  },
  {
    role: "Intern Software Engineer",
    org: "Department of the Registrar of Companies · ICT Division",
    period: "Feb — Aug 2026",
    start: "2026-02",
    end: "2026-08",
    place: "Colombo, Sri Lanka",
    summary:
      "Built and maintained internal web systems for the ICT Division, including a centralized comment management system for eROC, a file tracking system and an IT inventory system.",
  },
];

/** The band that drifts across the page. */
export const band = ["Front-end", "Data science", "Machine learning", "UI / UX", "Full-stack", "Creative code"];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "Java", "C / C++", "JavaScript", "TypeScript", "SQL", "R"] },
  { group: "Web & apps", items: ["React", "Next.js", "MERN stack", "Vue.js", "FastAPI", "Tailwind CSS", "HTML / CSS"] },
  { group: "Data & ML", items: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn", "TensorFlow", "PyTorch", "Django", "Flask"] },
  { group: "Databases", items: ["MongoDB", "MySQL", "Supabase", "Firebase"] },
  { group: "Cloud & DevOps", items: ["AWS", "Azure", "Docker", "Kubernetes", "Linux", "Vercel"] },
  { group: "Design", items: ["Figma", "Canva", "Adobe XD", "Sketch", "On-page SEO"] },
  { group: "AI tools", items: ["OpenAI", "Gemini", "Google AI Studio", "Qwen", "Grok", "Cursor"] },
  { group: "Workflow", items: ["Git", "GitHub", "Replit", "Spaceship"] },
];

/** Little pills that fall into the footer. */
export const footerPills = [
  "React", "Python", "Next.js", "Figma", "SQL", "TypeScript", "ML", "Supabase", "Java", "UI/UX", "Data", "Node.js", "Docker", "AWS",
];

export const about = {
  hello: ["Hi, I'm", "Harsha."],
  caption: "Somewhere between a codebase and a library shelf.",
  body: [
    "I'm a software engineer and data scientist from Sri Lanka. My work moves between full-stack development, machine learning and data analytics, and I like to own a product end to end, from the first Figma frame to the last deploy.",
    "With a foundation in computer science and mathematics, I enjoy the hard problems and the quiet details. I run One Billion Labs, a studio building web products for real businesses, and I'm co-founding Quintolink.",
  ],
  aside:
    "When I'm not coding, I'm exploring new tech, contributing to open source and sharing what I learn with the developer community.",
  facts: [
    ["Based in", "Malabe, Sri Lanka"],
    ["Background", "Computer science"],
    ["Focus", "Full-stack & data"],
    ["Now", "One Billion Labs · Quintolink"],
  ] as [string, string][],
};

export const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];
