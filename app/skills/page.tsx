import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveals from "@/components/Reveals";
import PageIntro from "@/components/PageIntro";
import Skills from "@/components/Skills";
import { skills, site } from "@/content/site";

const count = skills.reduce((n, g) => n + g.items.length, 0);
const description = `The languages, frameworks and tools ${site.name} works with — React, Next.js, Spring Boot, Python, PostgreSQL, YOLO and more — each linked to the projects that use it.`;

export const metadata: Metadata = {
  title: "Skills & technologies",
  description,
  alternates: { canonical: "/skills" },
  openGraph: { url: "/skills", title: `Skills & technologies — ${site.name}`, description },
  twitter: { title: `Skills & technologies — ${site.name}`, description },
};

export default function SkillsPage() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="subpage">
        <PageIntro
          num="01"
          label="Toolkit"
          title="Skills & technologies"
          lead="Hover any skill to see up to three projects where I've used it. Click it to see every one. Lighter names are tools I use but don't have a public project for yet."
          stats={[
            { n: count, label: "Skills & tools" },
            { n: skills.length, label: "Groups" },
          ]}
          links={[{ href: "/projects", label: "All projects" }]}
        />
        <Skills standalone />
      </main>
      <Footer num="02" />
      <Reveals />
    </>
  );
}
