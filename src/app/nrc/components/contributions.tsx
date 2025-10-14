import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function ContributionsSection() {
  return (
    <div className="mb-16">
      <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-medium text-white">
              My Contributions
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-zinc-900/30 rounded-lg border border-zinc-800">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-3 flex-shrink-0"></div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src="/emojis/kuromi_spin.gif"
                    alt="Kuromi Spin"
                    width={24}
                    height={24}
                    className="rounded"
                  />
                  <h3 className="font-medium text-white">Client Development</h3>
                </div>
                <p className="text-sm text-zinc-400">
                  Active development on the NoRisk Client itself, implementing
                  features requested by the community and improving overall user
                  experience and performance.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-zinc-900/30 rounded-lg border border-zinc-800">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src="/emojis/kuromi_roll.gif"
                    alt="Kuromi Roll"
                    width={24}
                    height={24}
                    className="rounded"
                  />
                  <h3 className="font-medium text-white">
                    Server API Development
                  </h3>
                </div>
                <p className="text-sm text-zinc-400">
                  Created the NoRisk Client Server API that allows server owners
                  to interact directly with the client, control modules and much
                  more.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-zinc-900/30 rounded-lg border border-zinc-800">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-3 flex-shrink-0"></div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src="/emojis/kuromi_blush.gif"
                    alt="Happy Kuromi"
                    width={24}
                    height={24}
                    className="rounded"
                  />
                  <h3 className="font-medium text-white">
                    Server Mappings System (Pretty Servers)
                  </h3>
                </div>
                <p className="text-sm text-zinc-400">
                  Developed the server mappings system that allows servers to
                  customize their appearance in the client, disable specific
                  modules, and provide server-specific configurations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-zinc-900/30 rounded-lg border border-zinc-800">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-3 flex-shrink-0"></div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src="/emojis/kuromi_laugh.gif"
                    alt="Kuromi Laugh"
                    width={24}
                    height={24}
                    className="rounded"
                  />
                  <h3 className="font-medium text-white">
                    Documentation & Community
                  </h3>
                </div>
                <p className="text-sm text-zinc-400">
                  Documentation creation and community support, ensuring
                  developers and server owners have all the resources they need
                  to integrate with NoRisk Client.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
