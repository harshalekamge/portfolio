import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content/site";

export const alt = "Harsha Lekamge — Software Engineer & Data Scientist in Sri Lanka";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const [sans, mono, photo] = await Promise.all([
    readFile(join(process.cwd(), "app/fonts/uncut-sans-latin-500-normal.woff")),
    readFile(join(process.cwd(), "app/fonts/jetbrains-mono-latin-400-normal.woff")),
    readFile(join(process.cwd(), "public/images/harsha-lekamge-sm.jpg")),
  ]);
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;
  const ink = "#141210";
  const paper = "#ecebe7";
  const accent = "#2337ff";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: paper, color: ink, padding: "48px 56px", fontFamily: "Uncut", position: "relative" }}>
        {Array.from({ length: 11 }, (_, i) => (
          <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: 56 + ((1200 - 112) / 12) * (i + 1), width: 1, background: "rgba(20,18,16,.08)" }} />
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Mono", fontSize: 18, letterSpacing: 1, textTransform: "uppercase" }}>
          <span>portfolio.harshalekamge.com</span>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: 10, background: "#22c55e" }} /> {site.available}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 40, fontSize: 150, lineHeight: 0.86, letterSpacing: -6, textTransform: "uppercase" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            HARSHA
            <img src={src} width={210} height={128} style={{ objectFit: "cover", objectPosition: "50% 35%", borderRadius: 6 }} alt="" />
          </div>
          <div style={{ display: "flex", marginLeft: 210, color: ink }}>
            LEKAMGE<span style={{ color: accent }}>.</span>
          </div>
        </div>
        <div style={{ display: "flex", marginTop: "auto", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 34, lineHeight: 1.15, letterSpacing: -1, maxWidth: 760 }}>
            <span>Software engineer &amp; data scientist.</span>
            <span style={{ color: "#6b6760" }}>Founder & CEO of One Billion Labs · Co-founder of Quintolink</span>
          </div>
          <div style={{ display: "flex", fontFamily: "Mono", fontSize: 18, textTransform: "uppercase", letterSpacing: 1 }}>{site.location}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Uncut", data: sans, weight: 500, style: "normal" },
        { name: "Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
