import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function FeaturesSection() {
  return (
    <div className="mb-16">
      <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <FontAwesomeIcon
              icon={faBook}
              className="w-6 h-6 text-blue-400"
            />
            <h2 className="text-2xl font-medium text-white">Features</h2>
          </div>

          <div className="space-y-6 text-zinc-300">
            <div>
              <h3 className="text-lg font-medium text-white mb-3">
                Two Methods to Cycle Trades:
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-zinc-900/30 rounded-lg border border-zinc-800">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-medium text-white mb-1">
                      Press F (default)
                    </h4>
                    <p className="text-sm text-zinc-400">
                      Press the button associated with swapping items to your
                      offhand.{" "}
                      <span className="text-yellow-400">Important:</span> The
                      cursor needs to be in the inventory due to Minecraft
                      limitations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-zinc-900/30 rounded-lg border border-zinc-800">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-medium text-white mb-1">
                      Shift Right Click
                    </h4>
                    <p className="text-sm text-zinc-400">
                      Shift right-click on the villager to cycle through trades.
                      This variant is disabled by default but can be enabled in
                      the config. Made with Bedrock and Geyser in mind.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
              <p className="text-yellow-300 text-sm">
                <strong>🚨 Note:</strong> If a villager has no profession or has
                been traded with, you cannot cycle through trades.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}