"use client";

/*
  Coming back to the home page lands you where you left it.
  - Clicking from the home page to /projects or /skills remembers the scroll position.
  - Clicking a plain "/" link on those pages (Home, ← Home), or using the browser's back
    button, brings you back to that position instead of the top or the bottom.
*/
const KEY_Y = "hl-home-y";
const KEY_GO = "hl-home-restore";
const SUB = ["/projects", "/skills"];

export function trackReturns() {
  const onClick = (e: MouseEvent) => {
    const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!a || a.origin !== location.origin || a.target === "_blank") return;
    try {
      if (location.pathname === "/" && SUB.includes(a.pathname)) sessionStorage.setItem(KEY_Y, String(Math.round(scrollY)));
      if (SUB.includes(location.pathname) && a.pathname === "/" && !a.hash) sessionStorage.setItem(KEY_GO, "1");
    } catch {}
  };
  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
}

/** On the home page: the position to restore, if we're coming back from a sub-page. */
export function pendingReturn(): number | null {
  if (location.pathname !== "/" || location.hash) return null;
  try {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const back = nav?.type === "back_forward";
    const asked = sessionStorage.getItem(KEY_GO) === "1";
    sessionStorage.removeItem(KEY_GO);
    const y = Number(sessionStorage.getItem(KEY_Y));
    if ((back || asked) && y > 0) return y;
  } catch {}
  return null;
}
