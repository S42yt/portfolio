import CardHome from "@/components/card-home";
import WorkedFor from "@/components/worked-for";
import FloatingNav from "@/components/navbar";
import Hero from "@/components/hero";
import SkillsSection from "@/components/skills";

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
      <FloatingNav />
      <div id="home" className="min-h-screen noise-overlay">
        <Hero />

        <section id="about" className="max-w-5xl mx-auto px-6 md:px-12 pb-16">
          <SkillsSection skills={skills} />
        </section>

        <section id="projects" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 pl-0">
              <h2
                className="font-display font-black leading-none tracking-tight mb-4"
                style={{
                  fontSize: "clamp(3rem, 8vw, 6rem)",
                  color: "var(--text)",
                }}
              >
                Projects
              </h2>
              <div className="section-rule mb-4" />
              <p
                className="text-sm font-mono"
                style={{ color: "var(--text-faint)" }}
              >
                A selection of things I&apos;ve built. More on GitHub.
              </p>
            </div>
            <CardHome />
          </div>
        </section>

        <WorkedFor />
      </div>
    </>
  );
}
