"use client";

import Image from "next/image";

interface MarqueeProps {
  images: string[];
}

export default function MarqueeSection({ images }: MarqueeProps) {
  const repeatedImages = Array(20).fill(images).flat();

  return (
    <div className="mb-20 overflow-hidden">
      <div className="flex">
        <div className="flex gap-16 animate-marquee">
          {repeatedImages.map((image, index) => (
            <div
              key={`set1-${index}`}
              className="flex-shrink-0"
            >
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border-2 border-zinc-800 hover:border-zinc-600 transition-colors duration-300">
                <Image
                  src={`/image/pfp/${image}`}
                  alt={image.replace(/\.[^/.]+$/, "")}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-16 animate-marquee" aria-hidden="true">
          {repeatedImages.map((image, index) => (
            <div
              key={`set2-${index}`}
              className="flex-shrink-0"
            >
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border-2 border-zinc-800 hover:border-zinc-600 transition-colors duration-300">
                <Image
                  src={`/image/pfp/${image}`}
                  alt={image.replace(/\.[^/.]+$/, "")}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
