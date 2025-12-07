import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

export default function WhatIsBurntSection() {
  return (
    <div className="mb-16">
      <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <FontAwesomeIcon icon={faGlobe} className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-medium text-white">
              What is Burnt.rip?
            </h2>
          </div>

          <div className="space-y-4 text-zinc-300">
            <p>
              Burnt.rip is an online profile platform designed specifically for{" "}
              <strong className="text-white">
                gamers, streamers, and social media users
              </strong>
              . Think of it as a modern, customizable bio page with deep Discord
              integration.
            </p>
            <p>
              Instead of sharing multiple links across different platforms, you
              can create a single, beautiful profile page that showcases all
              your social presence in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
