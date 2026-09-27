import CardHome from "@/components/card-home";
import WorkedFor from "@/components/worked-for";
import FloatingNav from "@/components/navbar";
import Hero from "@/components/hero";
import SkillsSection from "@/components/skills";
import Ticker from "@/components/ticker";
import GsapFx from "@/components/gsap-fx";
import AeroWindow from "@/components/aero-window";

export default function Home() {
  const skills = [
    {
      name: "C",
      icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/c/c-original.svg",
    },
    {
      name: "TypeScript",
      icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg",
    },
    {
      name: "Next.js",
      icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg",
    },
    {
      name: "Astro",
      icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/astro/astro-original.svg",
    },
    {
      name: "Java",
      icon: "https://raw.githubusercontent.com/devicons/devicon/refs/heads/master/icons/java/java-original.svg",
    },
    {
      name: "Rust",
      icon: "https://raw.githubusercontent.com/devicons/devicon/refs/heads/master/icons/rust/rust-original.svg",
    },
    {
      name: "Go",
      icon: "https://raw.githubusercontent.com/devicons/devicon/refs/heads/master/icons/go/go-original-wordmark.svg",
    },
    {
      name: "Kotlin",
      icon: "https://raw.githubusercontent.com/devicons/devicon/refs/heads/master/icons/kotlin/kotlin-original.svg",
    },
  ];

  return (
    <>
      <GsapFx />
      <FloatingNav />
      <div className="min-h-screen noise-overlay overflow-x-clip">
        <section id="home">
          <Hero />

          <div
            data-gsap="fade-up"
            data-glitch
            className="hero-skills max-w-5xl mx-auto px-6 md:px-12 pb-14"
          >
            <SkillsSection skills={skills} />
          </div>

          <Ticker
            items={[
              "Developer",
              "UI/UX",
              "Performance",
              "TypeScript",
              "Rust",
              "Next.js",
            ]}
          />
        </section>

        <section id="projects" className="relative py-20">
          <span
            data-gsap="giant"
            aria-hidden="true"
            className="giant-text top-4"
          >
            Projects
          </span>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <AeroWindow title="Projects - S42">
              <div className="mb-12">
                <h2 data-gsap="section-title" className="section-title mb-4">
                  Projects
                </h2>
                <div className="section-rule mb-4" />
                <p
                  data-gsap="fade-up"
                  className="text-sm"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  A selection of things I&apos;ve built. More on GitHub.
                </p>
              </div>
              <CardHome />
            </AeroWindow>
          </div>
        </section>

        <Ticker
          reverse
          items={[
            "NoRisk Client",
            "Trade Cycle",
            "Burnt",
            "CuteCraft",
            "Open Source",
            "S42",
          ]}
        />

        <WorkedFor />
      </div>
    </>
  );
}
