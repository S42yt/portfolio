"use client";

import Image from "next/image";

interface MarqueeProps {
  images: string[];
}

export default function MarqueeSection({ images }: MarqueeProps) {
  const repeatedImages = Array(20).fill(images).flat();

  return (
    <div className="marquee-container mb-20 overflow-hidden">
      <div className="flex">
        <div className="flex gap-16 animate-marquee">
          {repeatedImages.map((image, index) => {
            const isGiggand =
              image === "giggand.png" ||
              image.replace(/\.[^/.]+$/, "") === "giggand";
            return (
              <div key={`set1-${index}`} className="flex-shrink-0">
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border-2 border-zinc-800 hover:border-zinc-600 transition-colors duration-300">
                  {isGiggand ? (
                    <a
                      href="https://twitch.tv/giggand"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full"
                    >
                      <Image
                        src={`/image/pfp/${image}`}
                        alt={image.replace(/\.[^/.]+$/, "")}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </a>
                  ) : (
                    <Image
                      src={`/image/pfp/${image}`}
                      alt={image.replace(/\.[^/.]+$/, "")}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-16 animate-marquee" aria-hidden="true">
          {repeatedImages.map((image, index) => {
            const isGiggand =
              image === "giggand.png" ||
              image.replace(/\.[^/.]+$/, "") === "giggand";
            return (
              <div key={`set2-${index}`} className="flex-shrink-0">
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border-2 border-zinc-800 hover:border-zinc-600 transition-colors duration-300">
                  {isGiggand ? (
                    <a
                      href="https://twitch.tv/giggand"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full"
                    >
                      <Image
                        src={`/image/pfp/${image}`}
                        alt={image.replace(/\.[^/.]+$/, "")}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </a>
                  ) : (
                    <Image
                      src={`/image/pfp/${image}`}
                      alt={image.replace(/\.[^/.]+$/, "")}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
