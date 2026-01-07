import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";

export default function WhatIsNRCSection() {
  return (
    <div className="mb-16">
      <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <FontAwesomeIcon
              icon={faGamepad}
              className="w-6 h-6 text-green-400"
            />
            <h2 className="text-2xl font-medium text-white">
              What is NoRisk Client?
            </h2>
          </div>

          <div className="space-y-4 text-zinc-300">
            <p>
              NoRisk Client is a{" "}
              <strong className="text-white">
                modern, feature-rich Minecraft client
              </strong>{" "}
              designed with performance, and user experience in mind.
            </p>
            <p>
              The client focuses on{" "}
              <strong className="text-white">transparent development</strong>{" "}
              and community-driven features, ensuring that players get the
              functionality they need while server owners have full control over
              what&apos;s allowed on their networks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
