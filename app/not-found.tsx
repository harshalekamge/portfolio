import Link from "next/link";

export default function NotFound() {
  return (
    <main className="notfound" id="main">
      <p className="label mono">(404)</p>
      <h1>Nothing here.</h1>
      <p>This page doesn&apos;t exist, but the rest of the site does.</p>
      <Link className="pill" href="/">
        <span className="roll" data-text="Back home ↗">
          <span>Back home ↗</span>
        </span>
      </Link>
    </main>
  );
}
