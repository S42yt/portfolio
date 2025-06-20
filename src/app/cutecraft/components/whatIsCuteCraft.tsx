import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faServer } from '@fortawesome/free-solid-svg-icons';

export default function WhatIsCuteCraftSection() {
  return (
    <div className="mb-16">
      <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 via-transparent to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <FontAwesomeIcon
              icon={faServer}
              className="w-6 h-6 text-pink-400"
            />
            <h2 className="text-2xl font-medium text-white">
              What is CuteCraft?
            </h2>
          </div>

          <div className="space-y-4 text-zinc-300">
            <p>
              <strong className="text-white">CuteCraft</strong> is a premium
              German Minecraft CityBuild network that provides players with
              an exceptional CityBuild experience. Our server feature
              custom-designed gameplay mechanics, unique items, and a
              thriving community.
            </p>
            <p>
              Whether you&apos;re a casual player or a more professional
              player, CuteCraft offers something for everyone community
              events, and active German-speaking playerbase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}