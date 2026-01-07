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
        <div className="py-20">
          <Hero />
          <section id="about" className="max-w-4xl mx-auto px-6">
            <SkillsSection skills={skills} />
          </section>
        </div>
        <section id="projects" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-light text-white mb-4 tracking-tight font-mono">
                Projects
              </h2>
              <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed font-mono max-w-3xl mx-auto">
                These are by far not all projects I have worked on. To see more,
                check out my GitHub linked at the top!
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
