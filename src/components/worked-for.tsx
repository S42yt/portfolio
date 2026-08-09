"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";
import { useEffect, useState } from "react";
import Reveal from "./reveal";

const COLLABORATORS = [
  { file: "giggand.png", name: "Giggand", href: "https://twitch.tv/giggand" },
  { file: "tuubaa.png", name: "Tuubaa", href: "https://youtube.com/@tuubaa" },
  { file: "norisk.png", name: "NoRisk", href: "https://youtube.com/@NoRiskk" },
  {
    file: "holzi.png",
    name: "einHolzkopf",
    href: "https://www.youtube.com/@einHolzkopf",
  },
  { file: "ren.png", name: "Ren", href: "https://github.com/tsundosika" },
  { file: "nrc.png", name: "NoRisk Client", href: "https://norisk.gg" },
];

const MARQUEE_REPEATS = 4;

export default function WorkedFor() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <section id="worked-for" className="py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="mb-12">
          <h2 className="section-title mb-4">Worked For</h2>
          <div className="section-rule mb-4" />
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            People and projects I&apos;ve had the pleasure to collaborate with
          </p>
        </Reveal>

        <div className="mb-20">
          <Marquee
            gradient={false}
            speed={40}
            pauseOnHover
            play={!prefersReducedMotion}
          >
            {Array.from({ length: MARQUEE_REPEATS }, () => COLLABORATORS)
              .flat()
              .map((person, index) => (
                <a
                  key={`${person.file}-${index}`}
                  href={person.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="media-frame mx-4 block overflow-hidden rounded-[var(--radius-lg)]"
                >
                  <Image
                    src={`/image/pfp/${person.file}`}
                    alt={person.name}
                    width={128}
                    height={128}
                    className="h-24 w-24 object-cover md:h-32 md:w-32"
                  />
                </a>
              ))}
          </Marquee>
        </div>

        <div
          className="max-w-4xl pt-10"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <Reveal>
              <a
                href="https://namemc.com/skin/6ddb655c5b495314"
                target="_blank"
                rel="noopener noreferrer"
                className="media-frame block overflow-hidden rounded-[var(--radius-lg)]"
              >
                <Image
                  src="/image/preview/giggand_skin.png"
                  alt="Minecraft skin designed for Giggand"
                  width={640}
                  height={360}
                  className="h-auto w-full object-contain"
                />
              </a>
            </Reveal>

            <Reveal delay={120}>
              <p className="eyebrow mb-4">Collaboration</p>
              <h3
                className="font-display font-black leading-none tracking-tight mb-5"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  color: "var(--text)",
                }}
              >
                Giggand
              </h3>
              <p className="prose-body mb-8">
                I made a skin with my friend{" "}
                <a
                  href="https://tinusjankowski.de/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-accent"
                >
                  einp2pe
                </a>{" "}
                for the famous German Twitch streamer{" "}
                <span style={{ color: "var(--accent)" }}>Giggand</span>.
              </p>

              <a
                href="https://namemc.com/skin/6ddb655c5b495314"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                View on NameMC ↗
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
