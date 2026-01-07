import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpotify,
  faTwitch,
  faYoutube,
  faDiscord,
} from "@fortawesome/free-brands-svg-icons";

export default function HowItWorksSection() {
  return (
    <div className="mb-16">
      <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <h2 className="text-2xl font-medium text-white mb-6 text-center">
            How It Works
          </h2>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="text-center mb-4">
              <span className="text-lg font-mono text-cyan-400">
                burnt.rip/username
              </span>
            </div>

            <div className="space-y-3 text-sm text-zinc-300">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faSpotify}
                  className="w-4 h-4 text-green-400"
                />
                <span>
                  Currently listening to: &quot;Song Name&quot; by Artist
                </span>
              </div>

              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faTwitch}
                  className="w-4 h-4 text-purple-400"
                />
                <span>🔴 Live streaming Minecraft</span>
              </div>

              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faYoutube}
                  className="w-4 h-4 text-red-400"
                />
                <span>Latest video: &quot;How to Build in Minecraft&quot;</span>
              </div>

              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faDiscord}
                  className="w-4 h-4 text-indigo-400"
                />
                <span>Online - Playing Minecraft</span>
              </div>
            </div>
          </div>

          <p className="text-center text-zinc-400 text-sm mt-4">
            One link, all your platforms. Simple and effective.
          </p>
        </div>
      </div>
    </div>
  );
}
