/**
 * Everything the site says lives here. Edit this file to update the portfolio:
 * projects, experience, skills, links and SEO text all come from these objects.
 */

export const site = {
  url: "https://www.harshalekamge.com",
  name: "Harsha Lekamge",
  shortName: "Harsha",
  initials: "HL",
  title: "Harsha Lekamge — Software Engineer & Data Scientist, Sri Lanka",
  description:
    "Harsha Lekamge is a software engineer and data scientist from Sri Lanka. Web apps, data science and UI/UX, designed and built end to end. See projects, skills and experience.",
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
    "Harsha Lekamge portfolio",
    "harshalekamge",
    "SLIIT Data Science",
  ],
  locale: "en_US",
  location: "Malabe, Sri Lanka",
  city: "Malabe",
  region: "Western Province",
  country: "Sri Lanka",
  countryCode: "LK",
  timeZone: "Asia/Colombo",
  email: "contact@harshalekamge.com",
  /** Every address people can reach Harsha on, in the order they're shown. */
  emails: ["contact@harshalekamge.com", "harshalekamge.official@gmail.com", "lekamge.h2024@gmail.com"],
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

/**
 * Screenshots that cycle inside the two image boxes in the hero (and only there).
 * They're shown whole; tone fills any gap if a shot is a different shape from the box.
 */
export type HeroShot = { src: string; alt: string; tone: string };
export const heroShots: { a: HeroShot[]; b: HeroShot[] } = {
  a: [
    { src: "/images/hero/1b-labs-hero.webp", alt: "One Billion Labs website hero", tone: "#7c3aed" },
    { src: "/images/hero/quintolink-hero.webp", alt: "Quintolink website hero", tone: "#ffffff" },
    { src: "/images/hero/quintolink-stack.webp", alt: "Quintolink tech stack section", tone: "#ffffff" },
    { src: "/images/hero/1b-labs-footer.webp", alt: "One Billion Labs website footer", tone: "#ffffff" },
  ],
  b: [
    { src: "/images/hero/quintolink-industries.webp", alt: "Quintolink industries section", tone: "#ffffff" },
    { src: "/images/hero/quintolink-about.webp", alt: "Quintolink: Building what's next", tone: "#ffffff" },
    { src: "/images/hero/quintolink-team.webp", alt: "Quintolink contact section", tone: "#ffffff" },
  ],
};

/** Pinned intro statement: words fill in as you scroll. Wrap a phrase in *stars* to mark it. */
export const statement =
  "I build software people actually use. Web apps, data pipelines and machine-learning models, designed in *Figma* and shipped in *code*. I run *One Billion Labs*, co-founded *Quintolink*, and I care about the details users never notice, until they're missing.";

export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  title: string;
  /** featured: big stacked card with a screenshot. engineering / collab: rows in the index below. */
  group: "featured" | "engineering" | "collab";
  kind: string;
  year: string;
  line: string;
  description: string;
  /** Canonical skill names, exactly as they appear in `skills` below. Drives the skill hovers. */
  tech: string[];
  links: ProjectLink[];
  /** e.g. "Team project", "My part: …", "Internal tool" */
  note?: string;
  image?: string;
  imageAlt?: string;
  width?: number;
  height?: number;
  tone?: string;
  /** browser: a screenshot under a browser bar · phone: one phone screen · screens: a transparent strip of phone mockups */
  frame?: "browser" | "phone" | "screens";
};

const gh = (repo: string, label = "GitHub") => ({ label, href: `https://github.com/${repo}` });

export const projects: Project[] = [
  /* ---------- UI / UX: big cards with screenshots ---------- */
  {
    slug: "one-billion-labs",
    title: "One Billion Labs",
    group: "featured",
    kind: "Website · My studio",
    year: "2026",
    line: "My own studio's front door: fast, bright and built to win clients.",
    description:
      "The website for One Billion Labs, the software studio I founded in Colombo. Built with Astro and Lenis smooth scrolling, with a glowing gradient hero, a step-by-step process story and SEO tuned for search in Sri Lanka.",
    tech: ["Astro", "TypeScript", "HTML / CSS", "Lenis", "On-page SEO", "Vercel"],
    links: [{ label: "Live site", href: "https://www.onebillionlabs.com/" }],
    image: "/images/work/one-billion-labs.webp",
    imageAlt: "One Billion Labs website hero: a purple, cyan and pink gradient behind the words One Billion Labs",
    width: 1600,
    height: 1000,
    tone: "#3b1d8f",
  },
  {
    slug: "quintolink",
    title: "Quintolink",
    group: "featured",
    kind: "Website · Startup",
    year: "2026",
    line: "A studio that prints itself in halftone.",
    description:
      "The website for Quintolink, the startup I co-founded for web development, UI/UX, custom software and apps. Hand-built in HTML, CSS and JavaScript with an animated halftone canvas, Lenis scrolling and local SEO for Sri Lanka.",
    tech: ["JavaScript", "HTML / CSS", "Canvas", "Lenis", "On-page SEO", "Vercel", "Spaceship"],
    links: [{ label: "Live site", href: "https://quintolink.com/" }],
    image: "/images/work/quintolink.webp",
    imageAlt: "Quintolink website hero with the word Quinto, a halftone gear graphic and green and black panels",
    width: 1600,
    height: 1000,
    tone: "#0a0b14",
  },
  {
    slug: "kola-vision",
    tone: "#101114",
    title: "Kola Vision",
    group: "featured",
    kind: "AI research · Computer vision",
    year: "2026",
    line: "The eyes and hands of an accessible AI assistant: it sees the screen and clicks for you.",
    description:
      "My part of Kola, a multimodal AI assistant for accessible screen navigation. A YOLO11n model trained on an auto-labelled dataset finds 24 kinds of YouTube interface elements, OCR reads the text, and an executor moves the mouse to hover and click the element the user asked for, then checks the screen changed. On validation it scores 98.3% precision, 98.6% recall and 0.990 mAP50. Ships an ONNX model for a light 80 MB install and a browser extension that collects training data.",
    tech: ["Python", "YOLO", "PyTorch", "ONNX Runtime", "EasyOCR", "Google Colab", "NumPy"],
    links: [gh("harshalekamge/kola-vision")],
    note: "Team research project · my module",
    image: "/images/work/kola-vision.webp",
    imageAlt: "Kola Vision: a wireframe screen with labelled detection boxes for the sidebar, search box, chips and video cards, beside its validation scores: 98.3% precision, 98.6% recall, 0.990 mAP50",
    width: 1600,
    height: 1000,
  },
  {
    slug: "saloon-velora",
    title: "Saloon Velora",
    group: "featured",
    kind: "Website · AI · Client",
    year: "2026",
    line: "A salon site with real-time 3D and an AI beauty assistant.",
    description:
      "A premium salon website for a One Billion Labs client, built with React 19 and TypeScript. Real-time Three.js visuals, a gallery, a booking form and a Gemini-powered beauty assistant that answers questions in the salon's voice.",
    tech: ["React", "TypeScript", "Vite", "Three.js", "Tailwind CSS", "Gemini", "Google AI Studio", "Firebase"],
    links: [{ label: "Live site", href: "https://testsaloonvelora.web.app/" }],
    image: "/images/work/saloon-velora.webp",
    imageAlt: "Saloon Velora website homepage with the headline 'Your Beauty Redefined'",
    width: 1813,
    height: 850,
    tone: "#7a2335",
  },
  {
    slug: "saloon-ceylonima",
    title: "Saloon Ceylonima",
    group: "featured",
    kind: "Website · AI · Client",
    year: "2026",
    line: "A luxury salon that wanted its website to feel like the chair.",
    description:
      "A luxury salon website for a One Billion Labs client, built with React and TypeScript: refined visuals, elegant serif typography, smooth interactions and an AI stylist that suggests looks with Gemini. Hosted on Firebase.",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Gemini", "Google AI Studio", "Firebase"],
    links: [{ label: "Live site", href: "https://testsaloonceylonima.web.app/" }],
    image: "/images/work/saloon-ceylonima.webp",
    imageAlt: "Saloon Ceylonima website homepage with the headline 'Crafting Beauty with Passion & Precision'",
    width: 1626,
    height: 810,
    tone: "#6b1f2a",
  },
  {
    slug: "mihirna-banquet-hall",
    title: "Mihirna Banquet Hall",
    group: "featured",
    kind: "Website · Client",
    year: "2026",
    line: "A wedding venue in Weliweriya, dressed in gold and ivory.",
    description:
      "A multi-page website for a banquet hall in Weliweriya: services, gallery, reviews, facilities and a dedicated accessibility page, with React Router, a gold-and-ivory design system and local SEO for wedding and event searches.",
    tech: ["React", "TypeScript", "Vite", "React Router", "Tailwind CSS", "On-page SEO", "Google AI Studio"],
    links: [],
    note: "Client work · private repo",
    image: "/images/work/mihirna-banquet-hall.webp",
    imageAlt: "Mihirna Banquet Hall website hero: 'The Ultimate Venue For Your Grand Celebration' in white and gold",
    width: 1600,
    height: 1000,
    tone: "#2a1d12",
  },
  {
    slug: "megabite",
    title: "Megabite",
    group: "featured",
    kind: "Web app · Mobile-first",
    year: "2026",
    line: "Big bite on a tight budget: who paid, who owes.",
    description:
      "A mobile-first shared-expense tracker for two roommates. Log who paid and why, see running totals and who owes whom, and watch it sync between phones in real time through Firebase Firestore.",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Motion", "Firebase", "Google AI Studio"],
    links: [],
    note: "Personal project · private repo",
    image: "/images/work/megabite.webp",
    imageAlt: "Megabite app on a phone: totals for M and B, an add-expense form and a list of shared expenses",
    width: 645,
    height: 1398,
    tone: "#0f766e",
    frame: "phone",
  },
  {
    slug: "sales-shoe-mart",
    title: "Sales Shoe Mart",
    group: "featured",
    kind: "Mobile app UI",
    year: "2025",
    line: "A shoe store app laid out on the golden ratio.",
    description:
      "A visually balanced Figma mobile UI for a shoe retailer, with golden-ratio layouts, smooth transitions, custom branding and high-quality product visuals tuned for modern phones.",
    tech: ["Figma"],
    links: [
      { label: "Prototype", href: "https://www.figma.com/proto/vplOGgFsPXLNrstrGGs4gL/MAD_lab_test_01" },
      { label: "Figma file", href: "https://www.figma.com/design/vplOGgFsPXLNrstrGGs4gL/MAD_lab_test_01" },
    ],
    image: "/images/work/sole-mate-screens.webp",
    imageAlt:
      "Six screens of the shoe store app designed in Figma: home with new collection, product page with sizes, favourites, cart, side menu and log in",
    width: 3168,
    height: 1090,
    tone: "#1c1917",
    frame: "screens",
  },

  /* ---------- engineering & research: the index ---------- */
  {
    slug: "smart-campus",
    tone: "#1e3a8a",
    title: "Smart Campus Operations Hub",
    group: "engineering",
    kind: "Full-stack · University (IT3030 PAF)",
    year: "2026",
    line: "Bookings, resources, tickets and notifications for a whole campus, behind Google sign-in.",
    description:
      "A full-stack platform for running a university campus: resource catalogue, bookings, maintenance tickets and notifications. A Spring Boot REST API secured with Spring Security, Google OAuth 2.0 and JWT, five roles with an access matrix, Flyway migrations on PostgreSQL and Swagger docs; React + Material UI on the front.",
    tech: ["Java", "Spring Boot", "Spring Security", "OAuth 2.0", "JWT", "PostgreSQL", "Flyway", "REST APIs", "Swagger / OpenAPI", "SQL", "React", "Vite", "Material UI"],
    links: [gh("harshalekamge/it3030-paf-2026-smart-campus-group183")],
    note: "Team project",
    image: "/images/work/smart-campus.webp",
    imageAlt: "Smart Campus admin dashboard: a resources table with codes, buildings, capacity and status, and a sidebar for resource types, amenities and maintenance logs",
    width: 1600,
    height: 1000,
  },
  {
    slug: "file-tracking-system",
    tone: "#3f3a35",
    title: "File Tracking System",
    group: "engineering",
    kind: "Backend · Internship",
    year: "2026",
    line: "Replacing the Record Room's paper logbooks with a digital trail back to the 1900s.",
    description:
      "Built during my internship at the Department of the Registrar of Companies: a system to track physical company files in the Record Room. Inventory by year, company and shelf, borrow and return workflows, overdue alerts and a lifetime audit trail per file. Spring Boot REST API on PostgreSQL (Neon), documented with OpenAPI.",
    tech: ["Java", "Spring Boot", "PostgreSQL", "SQL", "REST APIs", "Swagger / OpenAPI", "Lombok"],
    links: [],
    note: "Internal government tool · private repo",
    image: "/images/work/file-tracking-system.webp",
    imageAlt: "File Tracking System API documentation listing the company, file and loan endpoints",
    width: 1600,
    height: 1000,
  },
  {
    slug: "roc-it-inventory",
    tone: "#1e40af",
    title: "ROC IT Inventory",
    group: "engineering",
    kind: "Full-stack · Internship",
    year: "2026",
    line: "Every PC in the department, its specs, its place and everything plugged into it.",
    description:
      "An IT asset management system for the ICT Division of the Registrar of Companies. It records each PC, where it sits, its status and full hardware specification (CPU, RAM, storage, monitor, network), plus the monitors, UPS units and other equipment attached to it. Spring Boot REST API with Spring Security and OAuth 2.0 on PostgreSQL, documented with OpenAPI; a React + Material UI data grid with Formik and Yup forms for the specifications.",
    tech: ["Java", "Spring Boot", "Spring Security", "OAuth 2.0", "PostgreSQL", "SQL", "REST APIs", "Swagger / OpenAPI", "Lombok", "React", "TypeScript", "Vite", "Material UI", "Formik", "Yup"],
    links: [],
    note: "Internal government tool · private repo",
    image: "/images/work/roc-it-inventory.webp",
    imageAlt: "ROC IT Inventory PC Specifications page: an edit form for one PC and a data grid of PCs with OS, CPU and RAM",
    width: 1600,
    height: 1000,
  },
  {
    slug: "eroc-comments",
    tone: "#0e7490",
    title: "eROC Comment Management System",
    group: "engineering",
    kind: "Full-stack · Internship",
    year: "2026",
    line: "Standard comments for company registration officers, one click away.",
    description:
      "A production-ready system for the eROC (online company registration) team: superadmins, admins and staff manage standardised comments per form and level, search them instantly, edit locally before copying, and keep a floating tool window open beside their work. React + Tailwind on Express and Prisma, JWT auth with bcrypt, installable as a PWA. It grew out of my first prototype: an always-on-top Electron tool on Express and PostgreSQL, hardened with Zod validation and Helmet.",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Motion", "Electron", "Node.js", "Express", "Prisma", "SQLite", "PostgreSQL", "SQL", "JWT", "REST APIs"],
    links: [],
    note: "Internal government tool · private repo",
    image: "/images/work/eroc-ccms.webp",
    imageAlt: "eROC Comment Management System staff dashboard: filters by form and comment cards ready to copy",
    width: 1600,
    height: 1000,
  },
  {
    slug: "portfolio",
    tone: "#2337ff",
    title: "This portfolio",
    group: "engineering",
    kind: "Website · Creative code",
    year: "2026",
    line: "Ink in WebGL, physics in the footer, and a lot of easing curves.",
    description:
      "The site you're on: Next.js with GSAP and Lenis for motion, a WebGL ink simulation, Matter.js physics, Supabase for the contact form and structured data for search.",
    tech: ["Next.js", "React", "TypeScript", "GSAP", "Lenis", "WebGL", "Supabase", "On-page SEO", "Vercel"],
    links: [gh("harshalekamge/portfolio")],
    image: "/images/work/portfolio.webp",
    imageAlt: "The home page of this portfolio",
    width: 1600,
    height: 1000,
  },

  /* ---------- collaborations ---------- */
  {
    slug: "cart-recovery-ai",
    tone: "#9a3412",
    title: "Shopping Cart Recovery AI",
    group: "collab",
    kind: "E-commerce · Information retrieval",
    year: "2025",
    line: "Spots abandoned carts and wins them back with the right offer.",
    description:
      "An e-commerce store that detects abandoned carts, sends tiered discounts and Gemini-written recovery emails, and recommends products with TF-IDF and cosine similarity. I worked on the recommendation engine, improving it with category-weighted TF-IDF.",
    tech: ["Python", "Flask", "MySQL", "SQL", "Scikit-learn", "Gemini", "Bootstrap"],
    links: [gh("ChanithW/Shopping_Cart_Recovery_AI_Project")],
    note: "With ChanithW and team",
    image: "/images/work/cart-recovery-ai.webp",
    imageAlt: "Shopping Cart Recovery admin dashboard with totals and a table of abandoned carts",
    width: 1600,
    height: 1000,
  },
  {
    slug: "offer-suggestor",
    tone: "#166534",
    title: "Offer Suggestor API",
    group: "collab",
    kind: "Machine learning · API",
    year: "2025",
    line: "Which offer will bring this shopper back? A model decides.",
    description:
      "A FastAPI service that predicts which offer an abandoning shopper is most likely to accept, from age, location, item and offer history. I compared Random Forest, Gradient Boosting, Logistic Regression, SVM and KNN before choosing the model.",
    tech: ["Python", "FastAPI", "Scikit-learn", "Pandas", "NumPy"],
    links: [{ label: "GitHub", href: "https://github.com/ChanithW/IRWA_Project/tree/harsha" }],
    note: "With ChanithW and team",
    image: "/images/work/offer-suggestor.webp",
    imageAlt: "Offer Suggestor API docs with a request and the predicted offer in the response",
    width: 1600,
    height: 1000,
  },
  {
    slug: "restaurant-cancellations",
    tone: "#b45309",
    title: "Restaurant Order Cancellation Prediction",
    group: "collab",
    kind: "Data science",
    year: "2026",
    line: "Flags orders likely to be cancelled before the kitchen starts cooking.",
    description:
      "A machine-learning model that predicts restaurant order cancellations from historical orders: cleaning, EDA, feature engineering, Random Forest and XGBoost models, and a Streamlit app to try it.",
    tech: ["Python", "Pandas", "NumPy", "Scikit-learn", "XGBoost", "Matplotlib", "Seaborn", "Streamlit"],
    links: [gh("amashi2003/restaurant_orders_cancellation_prediction")],
    note: "With amashi2003 and team",
    image: "/images/work/restaurant-cancellations.webp",
    imageAlt: "Restaurant Order Cancellation Prediction Streamlit app with order, customer and delivery inputs",
    width: 1600,
    height: 1000,
  },
  {
    slug: "greencycle",
    tone: "#15803d",
    title: "GreenCycle.lk",
    group: "collab",
    kind: "Full-stack · Sustainability",
    year: "2025",
    line: "Know your plastic footprint, then shrink it.",
    description:
      "A plastic-awareness platform for Sri Lanka: a footprint calculator, progress charts, reports as PDFs and email reminders. MERN stack with JWT auth, Chart.js and Recharts.",
    tech: ["MERN stack", "React", "Node.js", "Express", "MongoDB", "JWT", "Tailwind CSS", "JavaScript"],
    links: [gh("asjsolo/GreenCycle.lk")],
    note: "With asjsolo and team",
    image: "/images/work/greencycle.webp",
    imageAlt: "GreenCycle.lk home page: 'Join the Movement to End Plastic Pollution'",
    width: 1600,
    height: 1000,
  },
];

export const featuredProjects = projects.filter((p) => p.group === "featured");

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

/**
 * The ink pool in the middle of the page: two words, one per line, that keep changing.
 * The first pair comes back between the others and stays up longest.
 */
export const inkWords: [string, string][] = [
  ["Ideas", "to launch"],
  ["Code", "& craft"],
  ["Ideas", "to launch"],
  ["Data", "& design"],
];

/** The band that drifts across the page. */
export const band = ["Front-end", "Data science", "Machine learning", "UI / UX", "Full-stack", "Creative code"];

/**
 * Skills, tools and technologies. Hover one on the site to see the projects that use it;
 * those come from each project's `tech` list above (same spelling).
 */
export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "Java", "C / C++", "JavaScript", "TypeScript", "SQL", "R", "HTML / CSS"] },
  {
    group: "Front-end",
    items: ["React", "Next.js", "Astro", "Vite", "Vue.js", "Tailwind CSS", "Material UI", "Bootstrap", "React Router", "Formik", "Yup", "Electron", "Three.js", "WebGL", "Canvas", "GSAP", "Motion", "Lenis"],
  },
  {
    group: "Back-end & APIs",
    items: ["Node.js", "Express", "MERN stack", "Spring Boot", "Spring Security", "FastAPI", "Flask", "Django", "REST APIs", "OAuth 2.0", "JWT", "Swagger / OpenAPI", "Lombok"],
  },
  {
    group: "Data & ML",
    items: ["NumPy", "Pandas", "Matplotlib", "Seaborn", "Scikit-learn", "XGBoost", "TensorFlow", "PyTorch", "YOLO", "ONNX Runtime", "EasyOCR", "Streamlit", "Google Colab"],
  },
  { group: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "SQLite", "Prisma", "Flyway", "Supabase", "Firebase"] },
  { group: "Cloud & DevOps", items: ["Vercel", "AWS", "Azure", "Docker", "Kubernetes", "Linux"] },
  { group: "Design", items: ["Figma", "Canva", "Adobe XD", "Sketch", "On-page SEO"] },
  { group: "AI tools", items: ["Gemini", "Google AI Studio", "OpenAI", "Qwen", "Grok", "Cursor"] },
  { group: "Workflow", items: ["Git", "GitHub", "Replit", "Spaceship"] },
];

/** Little pills that fall into the footer. */
export const footerPills = [
  "React", "Python", "Next.js", "Figma", "Spring Boot", "TypeScript", "YOLO", "Supabase", "Java", "UI/UX", "Three.js", "Node.js", "FastAPI", "PostgreSQL",
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
  { label: "Work", href: "/#work" },
  { label: "Projects", href: "/projects" },
  { label: "Skills", href: "/skills" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "#contact" },
];
