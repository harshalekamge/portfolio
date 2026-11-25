import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveals from "@/components/Reveals";
import PageIntro from "@/components/PageIntro";
import ProjectGrid from "@/components/ProjectGrid";
import { projects, site } from "@/content/site";

const more = projects.filter((p) => p.group !== "featured");
const description = `Engineering, research and team projects by ${site.name}: Spring Boot platforms, internal government tools, a YOLO computer-vision assistant and machine-learning collaborations.`;

export const metadata: Metadata = {
  title: "Projects",
  description,
  alternates: { canonical: "/projects" },
  openGraph: { url: "/projects", title: `Projects — ${site.name}`, description },
  twitter: { title: `Projects — ${site.name}`, description },
};

export default function ProjectsPage() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="subpage">
        <PageIntro
          num="01"
          label="Projects"
          title="More projects"
          lead="The work where most of the effort lives in the code: back-ends, data models, research, and projects built with classmates and friends. Tap a technology to see everything else I've built with it."
          aside={
            <p className="mono pintro__stats">
              <span>{String(more.filter((p) => p.group === "engineering").length).padStart(2, "0")} engineering &amp; research</span>
              <span>{String(more.filter((p) => p.group === "collab").length).padStart(2, "0")} collaborations</span>
              <a href="/#work">See the featured work on the home page →</a>
              <a href="/skills">Browse by skill →</a>
            </p>
          }
        />
        <ProjectGrid />
      </main>
      <Footer num="02" />
      <Reveals />
    </>
  );
}
