import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

/** Saves a contact form message into Supabase (table: contact_submissions). */
export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ error: "Contact form is not configured" }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  // honeypot: real visitors never fill this in
  if (clip(body.company, 100)) return NextResponse.json({ ok: true });

  const row = {
    name: clip(body.name, 120),
    email: clip(body.email, 200),
    phone: clip(body.phone, 40),
    message: clip(body.message, 4000),
  };
  if (!row.name || !row.message || (!row.email && !row.phone)) {
    return NextResponse.json({ error: "Name, message and an email or phone are required" }, { status: 422 });
  }
  if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
    return NextResponse.json({ error: "That email doesn't look right" }, { status: 422 });
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from("contact_submissions").insert([row]);
  if (error) {
    console.error("contact insert failed", error.message);
    return NextResponse.json({ error: "Could not save message" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
