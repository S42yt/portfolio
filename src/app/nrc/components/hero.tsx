"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="text-center mb-16 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-blue-600/20 to-purple-600/20 blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-light text-white mb-4 tracking-tight font-mono flex items-center justify-center gap-4">
          <span>NoRisk</span>
          <Image
            src="/icons/nrc.png"
            alt="NoRisk Client Logo"
            width={64}
            height={64}
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%2342D1CD' rx='8'/%3E%3Ctext x='32' y='38' font-family='monospace' font-size='16' fill='white' text-anchor='middle'%3ENRC%3C/text%3E%3C/svg%3E";
            }}
          />
          <span>Client</span>
        </h1>
        <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed font-mono max-w-3xl mx-auto mb-6">
          Powerful Minecraft Client
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <span className="px-4 py-2 bg-green-600/20 border border-green-600/50 rounded-full text-green-300 text-sm font-medium">
            🎮 Minecraft
          </span>
          <span className="px-4 py-2 bg-purple-600/20 border border-purple-600/50 rounded-full text-purple-300 text-sm font-medium">
            ⚙️ Customizable
          </span>
          <span className="px-4 py-2 bg-cyan-600/20 border border-cyan-600/50 rounded-full text-cyan-300 text-sm font-medium">
            👥 Community
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://norisk.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-500 hover:to-blue-500 transition-all duration-300 font-medium text-lg"
          >
            <FontAwesomeIcon icon={faRocket} className="w-5 h-5" />
            Download NoRisk Client
          </a>

          <a
            href="https://docs.norisk.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-800 text-white border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-all duration-300 font-medium text-lg"
          >
            📖 Documentation
          </a>
        </div>
      </div>
    </div>
  );
}
