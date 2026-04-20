"use client";

import Image from "next/image";
import Link from "next/link";
import Marquee from "react-fast-marquee";

export default function WorkedFor() {
  const pfpImages = ["giggand.png", "tuubaa.png", "norisk.png", "holzi.png"];

  return (
    <section id="worked-for" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2
            className="font-display font-black leading-none tracking-tight mb-4"
            style={{
              fontSize: "clamp(3rem, 8vw, 6rem)",
              color: "var(--text)",
            }}
          >
            Worked For
          </h2>
          <div className="section-rule mb-4" />
          <p
            className="text-sm font-mono"
            style={{ color: "var(--text-faint)" }}
          >
            People and projects I&apos;ve had the pleasure to collaborate with
          </p>
        </div>

        <div className="mb-20">
          <Marquee
            gradient={false}
            speed={40}
            pauseOnHover={true}
            className="overflow-hidden"
          >
            {Array(10)
              .fill(pfpImages)
              .flat()
              .map((image, index) => {
                const imageName = image.replace(/\.[^/.]+$/, "");
                const isGiggand = imageName === "giggand";
                const isTuubaa = imageName === "tuubaa";
                const isNorisk = imageName === "norisk";
                const isHolzi = imageName === "holzi";

                const getLink = () => {
                  if (isGiggand) return "https://twitch.tv/giggand";
                  if (isTuubaa)  return "https://youtube.com/@tuubaa";
                  if (isNorisk)  return "https://youtube.com/@NoRiskk";
                  if (isHolzi)   return "https://www.youtube.com/@einHolzkopf";
                  return null;
                };

                const link = getLink();

                return (
                  <div key={index} className="mx-8">
                    <div
                      className="relative w-24 h-24 md:w-32 md:h-32 overflow-hidden transition-opacity duration-300 hover:opacity-80"
                      style={{ border: "1px solid var(--border)" }}
                    >
                      {link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full h-full"
                        >
                          <Image
                            src={`/image/pfp/${image}`}
                            alt={imageName}
                            width={128}
                            height={128}
                            className="object-cover w-full h-full"
                          />
                        </a>
                      ) : (
                        <Image
                          src={`/image/pfp/${image}`}
                          alt={imageName}
                          width={128}
                          height={128}
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
          </Marquee>
        </div>

        <div className="max-w-4xl">
          <div
            className="pt-8"
            style={{ borderTop: "1px solid var(--border-subtle)" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <a
                href="https://namemc.com/skin/6ddb655c5b495314"
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden transition-opacity duration-300 hover:opacity-80"
                style={{ border: "1px solid var(--border)" }}
              >
                <Image
                  src="/image/preview/giggand_skin.png"
                  alt="giggand_skin"
                  width={640}
                  height={360}
                  className="object-contain w-full h-auto"
                />
              </a>

              <div>
                <p
                  className="text-xs tracking-[0.3em] uppercase font-mono mb-4"
                  style={{ color: "var(--text-faint)" }}
                >
                  Collaboration
                </p>
                <h3
                  className="font-display font-black leading-none tracking-tight mb-5"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    color: "var(--text)",
                  }}
                >
                  Giggand
                </h3>
                <p
                  className="text-base leading-[1.75] font-mono font-light mb-8"
                  style={{ color: "var(--text-muted)" }}
                >
                  I made a skin with my friend{" "}
                    <Link
                    href="https://tinusjankowski.de/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--accent)" }}
                    className="hover:underline"
                    >
                    einp2pe
                    </Link>{" "}
                    for the famous German Twitch streamer{" "}
                  <span style={{ color: "var(--accent)" }}>Giggand</span>.
                </p>

                <a
                  href="https://namemc.com/skin/6ddb655c5b495314"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-mono transition-all duration-200 hover:opacity-70"
                  style={{
                    color: "var(--text-muted)",
                    border: "1px solid var(--border)",
                  }}
                >
                  View on NameMC
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
