"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

export default function HeroSection() {
  return (
    <div className="text-center mb-16 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-cyan-600/20 blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative z-10">
        <div className="mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/cutecraft-icon.png"
            alt="CuteCraft Logo"
            className="w-24 h-24 mx-auto mb-6 rounded-lg shadow-lg"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%23F3A5BE' rx='12'/%3E%3Ctext x='48' y='58' font-family='monospace' font-size='32' fill='white' text-anchor='middle'%3ECC%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>

        <h1 className="text-4xl md:text-6xl font-light text-white mb-4 tracking-tight font-mono">
          CuteCraft
        </h1>
        <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed font-mono max-w-3xl mx-auto mb-6">
          German Minecraft CityBuild Network
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <span className="px-4 py-2 bg-pink-600/20 border border-pink-600/50 rounded-full text-pink-300 text-sm font-medium">
            🎮 Minecraft
          </span>
          <span className="px-4 py-2 bg-purple-600/20 border border-purple-600/50 rounded-full text-purple-300 text-sm font-medium">
            🏗️ CityBuild
          </span>
          <span className="px-4 py-2 bg-cyan-600/20 border border-cyan-600/50 rounded-full text-cyan-300 text-sm font-medium">
            🇩🇪 German
          </span>
        </div>

        <a
          href="https://cutecraft.net"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-500 hover:to-purple-500 transition-all duration-300 font-medium"
        >
          <FontAwesomeIcon icon={faGlobe} className="w-5 h-5" />
          Visit Website
        </a>
      </div>
    </div>
  );
}
