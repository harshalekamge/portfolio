"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setupGsap, isStill } from "@/lib/motion";

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

    // in-page links glide instead of jumping
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!;
      const target = id === "#top" || id === "#" ? 0 : document.querySelector(id);
      if (target === null) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target as HTMLElement | number, { duration: 1.2 });
      else if (target === 0) window.scrollTo({ top: 0 });
      else (target as HTMLElement).scrollIntoView();
      if (id !== "#top" && id !== "#") history.replaceState(null, "", id);
    };
    document.addEventListener("click", onClick);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      stop();
      document.removeEventListener("hl:motion", onMotion);
      document.removeEventListener("hl:intro-done", onIntro);
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", refresh);
    };
  }, []);
  return null;
}
