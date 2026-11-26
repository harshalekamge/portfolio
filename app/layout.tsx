import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/content/site";
import { jsonLd } from "@/lib/seo";
import SmoothScroll from "@/components/SmoothScroll";
import Loader from "@/components/Loader";
import InkCursor from "@/components/InkCursor";
import Chrome from "@/components/Chrome";
import Dock from "@/components/Dock";

const sans = localFont({
  src: [
    { path: "./fonts/uncut-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/uncut-sans-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/uncut-sans-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/uncut-sans-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

const mono = localFont({
  src: [
    { path: "./fonts/jetbrains-mono-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/jetbrains-mono-latin-500-normal.woff2", weight: "500" },
  ],
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "Menlo", "monospace"],
});

const hand = localFont({
  src: [
    { path: "./fonts/caveat-latin-500-normal.woff2", weight: "500" },
    { path: "./fonts/caveat-latin-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-hand",
  display: "swap",
  preload: false,
  fallback: ["Comic Sans MS", "cursive"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: `${site.name} Portfolio`,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  keywords: site.keywords,
  category: "technology",
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: `${site.name} — Portfolio`,
    title: site.title,
    description: site.description,
    locale: site.locale,
    firstName: "Harsha",
    lastName: "Lekamge",
    username: "harshalekamge",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  verification: { google: site.googleVerification },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  other: {
    "geo.region": site.countryCode,
    "geo.placename": site.location,
  },
};

export const viewport: Viewport = {
  themeColor: "#ecebe7",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

/*
  Runs before first paint:
  - marks that JS is on (so hidden-until-animated states only apply when they will animate)
  - honours the saved Motion switch and the OS reduced-motion setting
  - shows the intro loader once per visit
*/
const boot = `(function(){try{var h=document.documentElement;h.classList.add('js');var r=matchMedia('(prefers-reduced-motion: reduce)').matches;var s=localStorage.getItem('hl-motion');var still=s===null?r:s==='off';if(still)h.classList.add('still');if(!still&&!sessionStorage.getItem('hl-intro'))h.setAttribute('data-loading','');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${hand.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()).replace(/</g, "\\u003c") }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <noscript>
          <style>{`.js [data-hide-until]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
        <Loader />
        <SmoothScroll />
        <Chrome />
        <InkCursor />
        {children}
        <Dock />
      </body>
    </html>
  );
}
