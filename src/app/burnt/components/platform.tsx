import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface Platform {
  name: string;
  icon: IconDefinition;
  color: string;
}

interface PlatformsSectionProps {
  platforms: Platform[];
}

export default function PlatformsSection({ platforms }: PlatformsSectionProps) {
  return (
    <div className="mb-16">
      <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-transparent to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <h2 className="text-2xl font-medium text-white mb-6 text-center">
            Supported Platforms
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {platforms.map((platform, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-all duration-300 group/platform"
              >
                <FontAwesomeIcon
                  icon={platform.icon}
                  className={`w-8 h-8 ${platform.color} mb-2 group-hover/platform:scale-110 transition-transform duration-300`}
                />
                <span className="text-sm text-zinc-300">{platform.name}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-zinc-400 text-sm">
            And many more platforms to showcase your online presence
          </p>
        </div>
      </div>
    </div>
  );
}
