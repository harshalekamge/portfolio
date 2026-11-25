"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

let registered = false;

/** Register GSAP plugins once and set the house easing. */
export function setupGsap() {
  if (registered || typeof window === "undefined") return gsap;
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  // the same curve both reference sites lean on: a long, soft landing
  CustomEase.create("osmo", "0.625, 0.05, 0, 1");
  CustomEase.create("soft", "0.2, 0.7, 0.2, 1");
  gsap.defaults({ ease: "osmo", duration: 0.8 });
  registered = true;
  return gsap;
}

/** True when the visitor asked for less motion (OS setting or the Motion switch). */
export function isStill() {
  if (typeof document === "undefined") return true;
  return document.documentElement.classList.contains("still");
}

export const finePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (a: number, b: number, t: number) => {
  const x = clamp((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};

/** Wait for the intro loader (if it is showing) before running entrance animations. */
export function afterIntro(fn: () => void) {
  if (typeof document === "undefined") return () => {};
  if (!document.documentElement.hasAttribute("data-loading")) {
    fn();
    return () => {};
  }
  const handler = () => fn();
  document.addEventListener("hl:intro-reveal", handler, { once: true });
  return () => document.removeEventListener("hl:intro-reveal", handler);
}

/**
 * A tiny spring, stepped manually. Used for things that should feel physical
 * (hover tags, magnetic buttons) without a library.
 */
export class Spring {
  v: number;
  t: number;
  vel = 0;
  k: number;
  c: number;
  constructor(value = 0, duration = 0.5, bounce = 0) {
    this.v = this.t = value;
    this.k = (2 * Math.PI / duration) ** 2;
    this.c = (4 * Math.PI * (1 - bounce)) / duration;
  }
  step(dt: number) {
    const sub = Math.max(1, Math.round(dt * 240));
    const h = dt / sub;
    for (let i = 0; i < sub; i++) {
      this.vel += (-this.k * (this.v - this.t) - this.c * this.vel) * h;
      this.v += this.vel * h;
    }
  }
  still(eps = 5e-4) {
    return Math.abs(this.v - this.t) < eps && Math.abs(this.vel) < eps * 4;
  }
  set(v: number) {
    this.v = this.t = v;
    this.vel = 0;
  }
}
