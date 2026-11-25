"use client";

import { useState } from "react";
import { site } from "@/content/site";

type State = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [note, setNote] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (!data.email && !data.phone) {
      setState("error");
      setNote("Leave an email or a phone number so I can get back to you.");
      return;
    }
    setState("sending");
    setNote("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status === 503) {
        // no inbox wired up: hand the message to the visitor's email app instead
        const body = `${data.message}\n\n${data.name}${data.phone ? `\n${data.phone}` : ""}`;
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Hello from ${data.name}`)}&body=${encodeURIComponent(body)}`;
        setState("sent");
        setNote("Opening your email app…");
        return;
      }
      if (!res.ok) throw new Error();
      form.reset();
      setState("sent");
      setNote("Thanks! Your message is in. I'll reply soon.");
    } catch {
      setState("error");
      setNote(`Something went wrong. Email me at ${site.email} instead.`);
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate={false}>
      <div className="form__row">
        <label className="field">
          <span className="mono">Name</span>
          <input name="name" type="text" required autoComplete="name" placeholder="Your name" maxLength={120} />
        </label>
      </div>
      <div className="form__row form__row--two">
        <label className="field">
          <span className="mono">Email</span>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={200} />
        </label>
        <label className="field">
          <span className="mono">Phone</span>
          <input name="phone" type="tel" autoComplete="tel" placeholder="+94 …" maxLength={40} />
        </label>
      </div>
      <label className="field">
        <span className="mono">Message</span>
        <textarea name="message" required rows={4} placeholder="Tell me about the project…" maxLength={4000} />
      </label>
      {/* bots fill this, people never see it */}
      <label className="form__trap" aria-hidden="true">
        Company
        <input name="company" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="form__foot">
        <button className="pill pill--solid" type="submit" disabled={state === "sending"}>
          <span className="roll" data-text={state === "sending" ? "Sending…" : "Send message →"}>
            <span>{state === "sending" ? "Sending…" : "Send message →"}</span>
          </span>
        </button>
        <p className={`form__note mono ${state === "error" ? "is-error" : ""}`} role="status" aria-live="polite">
          {note}
        </p>
      </div>
    </form>
  );
}
