"use client";

/**
 * Scroll to an element by id. Work cards are sticky, so measure where they sit in
 * the flow rather than where they're stuck. Index rows (<details>) get opened.
 */
export function scrollToId(id: string, opts: { immediate?: boolean } = {}) {
  const el = document.getElementById(id);
  if (!el) return false;
  const lenis = window.__lenis;
  let y: number;
  if (el.classList.contains("card")) {
    const prev = el.style.position;
    el.style.position = "relative";
    y = el.getBoundingClientRect().top + scrollY;
    el.style.position = prev;
  } else {
    el.querySelector("details")?.setAttribute("open", "");
    y = el.getBoundingClientRect().top + scrollY - (el.matches("section, footer") ? 0 : 90);
  }
  if (lenis) lenis.scrollTo(y, opts.immediate ? { immediate: true, force: true } : { duration: 1.3 });
  else window.scrollTo({ top: y, behavior: opts.immediate ? "auto" : "smooth" });
  return true;
}

/** Where a project lives: featured work on the home page, everything else on /projects. */
export const projectHref = (p: { slug: string; group: string }) =>
  `${p.group === "featured" ? "/" : "/projects"}#project-${p.slug}`;
