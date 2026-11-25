import { projects, type Project } from "@/content/site";

/** Skills whose projects are worked out from the links rather than listed in `tech`. */
const derived: Record<string, (p: Project) => boolean> = {
  GitHub: (p) => p.links.some((l) => l.href.includes("github.com")),
  Git: (p) => p.links.some((l) => l.href.includes("github.com")),
};

/** Projects that use a skill, best first (featured work, then engineering, then collaborations). */
export function projectsFor(skill: string): Project[] {
  const test = derived[skill] ?? ((p: Project) => p.tech.includes(skill));
  return projects.filter(test);
}

export const initials = (title: string) =>
  title
    .replace(/[^A-Za-z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
