"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";

export default function WorkedFor() {
  const pfpImages = ["giggand.png", "tuubaa.png", "norisk.png"];

  return (
    <section id="worked-for" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-linear-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 blur-3xl opacity-30 animate-pulse"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-light text-white mb-4 tracking-tight font-mono">
              Worked For
            </h2>
            <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed font-mono max-w-3xl mx-auto">
              People and projects I&apos;ve had the pleasure to work with
            </p>
          </div>
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
                
                const getLink = () => {
                  if (isGiggand) return "https://twitch.tv/giggand";
                  if (isTuubaa) return "https://youtube.com/@tuubaa";
                  if (isNorisk) return "https://youtube.com/@NoRiskk";
                  return null;
                };
                
                const link = getLink();
                
                return (
                  <div key={index} className="mx-8">
                    <div className="relative w-24 h-24 md:w-32 md:h-32 overflow-hidden border-2 border-zinc-800 hover:border-zinc-600 transition-colors duration-300">
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

        <div className="max-w-4xl mx-auto">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-linear-to-br from-purple-600/10 via-transparent to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <a
                  href="https://namemc.com/skin/6ddb655c5b495314"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all duration-300"
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
                  <h3 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight font-mono">
                    Giggand Collaboration
                  </h3>
                  <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed font-mono mb-6">
                    I made a skin with my friend{" "}
                    <span className="text-purple-400">einp2pe</span> for the
                    famous German Twitch streamer{" "}
                    <span className="text-purple-400">Giggand</span>.
                  </p>

                  <a
                    href="https://namemc.com/skin/6ddb655c5b495314"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 transition-all duration-300"
                  >
                    View on NameMC
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
