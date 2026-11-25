import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import Process from "@/components/Process";
import Work from "@/components/Work";
import Band from "@/components/Band";
import About from "@/components/About";
import { Experience, Skills } from "@/components/Experience";
import Footer from "@/components/Footer";
import Reveals from "@/components/Reveals";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Statement />
        <Process />
        <Work />
        <Band />
        <About />
        <Experience />
        <Skills />
      </main>
      <Footer />
      <Reveals />
    </>
  );
}
