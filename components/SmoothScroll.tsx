"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setupGsap, isStill } from "@/lib/motion";
import { scrollToId } from "@/lib/scrollTo";
import { trackReturns, pendingReturn } from "@/lib/returnTo";

declare global {
  interface Window {
    __lenis?: Lenis | null;
  }
}

/** Smooth scrolling (Lenis) driven by GSAP's ticker so ScrollTrigger stays in sync. */
export default function SmoothScroll() {
  useEffect(() => {
    setupGsap();
    history.scrollRestoration = "manual";
    let lenis: Lenis | null = null;
    const tick = (t: number) => lenis?.raf(t * 1000);

    const start = () => {
      if (lenis || isStill()) return;
      lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1.1 });
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      if (document.documentElement.hasAttribute("data-loading")) lenis.stop();
    };
    const stop = () => {
      if (!lenis) return;
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenis = null;
      window.__lenis = null;
    };
    start();

    const onMotion = () => (isStill() ? stop() : start());
    const onIntro = () => lenis?.start();
    document.addEventListener("hl:motion", onMotion);
    document.addEventListener("hl:intro-done", onIntro);

    // in-page links glide instead of jumping ("#x", or "/#x" while already on the home page)
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const href = a.getAttribute("href")!;
      let hash = "";
      if (href.startsWith("#")) hash = href;
      else if (a.origin === location.origin && a.pathname === location.pathname && a.hash) hash = a.hash;
      if (!hash) return;
      e.preventDefault();
      if (hash === "#top" || hash === "#") {
        if (lenis) lenis.scrollTo(0, { duration: 1.2 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (scrollToId(hash.slice(1))) history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    // coming back from /projects or /skills: return to the same spot
    const untrack = trackReturns();
    const back = pendingReturn();
    if (back !== null) {
      const go = () => {
        if (lenis) lenis.scrollTo(back, { immediate: true, force: true });
        else window.scrollTo(0, back);
        ScrollTrigger.refresh();
      };
      go();
      (document.fonts?.ready ?? Promise.resolve()).then(() => requestAnimationFrame(go));
      window.addEventListener("load", go, { once: true });
    }
    // restored from the back/forward cache: the page is intact, just resync the smooth scroller
    const onShow = (e: PageTransitionEvent) => {
      if (!e.persisted || !lenis) return;
      lenis.resize();
      lenis.scrollTo(scrollY, { immediate: true, force: true });
    };
    window.addEventListener("pageshow", onShow);

    // arriving with a #hash (e.g. /projects#project-kola-vision): go there once the page has settled
    if (location.hash.length > 1) {
      const id = decodeURIComponent(location.hash.slice(1));
      const go = () => scrollToId(id, { immediate: true });
      const intro = document.documentElement.hasAttribute("data-loading");
      if (intro) document.addEventListener("hl:intro-done", () => setTimeout(go, 50), { once: true });
      else (document.fonts?.ready ?? Promise.resolve()).then(() => setTimeout(go, 120));
    }

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      stop();
      document.removeEventListener("hl:motion", onMotion);
      document.removeEventListener("hl:intro-done", onIntro);
      document.removeEventListener("click", onClick);
      window.removeEventListener("pageshow", onShow);
      untrack();
      window.removeEventListener("load", refresh);
    };
  }, []);
  return null;
}
