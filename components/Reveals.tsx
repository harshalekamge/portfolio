"use client";

import { useEffect } from "react";
import { finePointer, afterIntro } from "@/lib/motion";

/**
 * Page-wide reveal behaviour, driven by CSS transitions:
 *  [data-reveal-lines]  words rise out of a mask one after another
 *  [data-reveal]        block fades and lifts in
 *  [data-reveal-rule]   each child's top rule draws across, staggered
 * Elements get `.is-in` when they cross 88% of the viewport.
 * Also: pill buttons lean toward the cursor.
 */
export default function Reveals() {
  useEffect(() => {
    const undo: (() => void)[] = [];

    document.querySelectorAll<HTMLElement>("[data-reveal-lines]").forEach((el) => {
      if (el.dataset.split) return;
      const text = el.textContent?.trim().replace(/\s+/g, " ") ?? "";
      el.dataset.split = "1";
      el.setAttribute("aria-label", text);
      el.innerHTML = text
        .split(" ")
        .map((w, i) => `<span class="rw" aria-hidden="true" style="--i:${i}"><span>${w.replace(/</g, "&lt;")}</span></span>`)
        .join(" ");
      undo.push(() => {
        el.textContent = text;
        el.removeAttribute("aria-label");
        delete el.dataset.split;
      });
    });
    document.querySelectorAll<HTMLElement>("[data-reveal-rule]").forEach((el) =>
      Array.from(el.children).forEach((c, i) => (c as HTMLElement).style.setProperty("--i", String(i))),
    );

    const targets = document.querySelectorAll<HTMLElement>("[data-reveal-lines], [data-reveal], [data-reveal-rule]");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -12% 0px" },
    );
    const stop = afterIntro(() => targets.forEach((t) => io.observe(t)));
    undo.push(stop, () => io.disconnect());

    // pills lean toward the cursor a little, then spring back
    if (finePointer()) {
      const onMove = (e: PointerEvent) => {
        const pill = (e.target as Element)?.closest?.<HTMLElement>(".pill");
        if (!pill) return;
        const r = pill.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        pill.style.translate = `${(dx * 10).toFixed(1)}px ${(dy * 6).toFixed(1)}px`;
        pill.style.rotate = `${(dx * 2.5).toFixed(2)}deg`;
      };
      const onOut = (e: PointerEvent) => {
        const pill = (e.target as Element)?.closest?.<HTMLElement>(".pill");
        if (!pill || pill.contains(e.relatedTarget as Node)) return;
        pill.style.translate = "";
        pill.style.rotate = "";
      };
      document.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerout", onOut, { passive: true });
      undo.push(() => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerout", onOut);
      });
    }
    return () => undo.forEach((f) => f());
  }, []);
  return null;
}
