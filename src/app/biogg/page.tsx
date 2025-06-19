import BackHome from "@/components/backHome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiscord,
  faSpotify,
  faTwitch,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faUser,
  faShield,
  faEye,
  faPalette,
  faLink,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";

export default function BioggPage() {
  const features = [
    {
      icon: faDiscord,
      title: "Discord Integration",
      description:
        "Sign in with Discord OAuth2 and display your real-time presence status",
      color: "text-indigo-400",
    },
    {
      icon: faPalette,
      title: "Customizable Profiles",
      description:
        "Add avatars, banners, and personalize your 'About Me' section",
      color: "text-purple-400",
    },
    {
      icon: faLink,
      title: "Social Links Hub",
      description:
        "Connect Twitch, YouTube, Spotify, and all your social platforms",
      color: "text-cyan-400",
    },
    {
      icon: faEye,
      title: "Real-Time Status",
      description:
        "Show your Discord presence, what you're playing, and streaming status",
      color: "text-green-400",
    },
    {
      icon: faGlobe,
      title: "Public Profiles",
      description: "Share your custom biogg.net/username page with everyone",
      color: "text-blue-400",
    },
    {
      icon: faShield,
      title: "Privacy & Security",
      description:
        "SSL/TLS encryption, GDPR compliance, and secure data handling",
      color: "text-red-400",
    },
  ];

  const platforms = [
    { name: "Discord", icon: faDiscord, color: "text-indigo-400" },
    { name: "Twitch", icon: faTwitch, color: "text-purple-400" },
    { name: "YouTube", icon: faYoutube, color: "text-red-400" },
    { name: "Spotify", icon: faSpotify, color: "text-green-400" },
  ];

  return (
    <div className="min-h-screen py-20 noise-overlay">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-purple-600/20 blur-3xl opacity-30 animate-pulse"></div>

          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-light text-white mb-4 tracking-tight font-mono">
              Biogg.net
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed font-mono max-w-3xl mx-auto mb-6">
              Create beautiful online profiles with Discord integration for
              gamers and streamers
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <span className="px-4 py-2 bg-cyan-600/20 border border-cyan-600/50 rounded-full text-cyan-300 text-sm font-medium">
                🎮 Gaming
              </span>
              <span className="px-4 py-2 bg-purple-600/20 border border-purple-600/50 rounded-full text-purple-300 text-sm font-medium">
                📺 Streaming
              </span>
              <span className="px-4 py-2 bg-blue-600/20 border border-blue-600/50 rounded-full text-blue-300 text-sm font-medium">
                🌐 Social
              </span>
            </div>

            <a
              href="https://biogg.net"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 font-medium"
            >
              <FontAwesomeIcon icon={faGlobe} className="w-5 h-5" />
              Visit Biogg.net
            </a>
          </div>
        </div>

        <div className="mb-16">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon
                  icon={faGlobe}
                  className="w-6 h-6 text-cyan-400"
                />
                <h2 className="text-2xl font-medium text-white">
                  What is Biogg.net?
                </h2>
              </div>

              <div className="space-y-4 text-zinc-300">
                <p>
                  Biogg.net is an online profile platform designed specifically
                  for{" "}
                  <strong className="text-white">
                    gamers, streamers, and social media users
                  </strong>
                  . Think of it as a modern, customizable bio page with deep
                  Discord integration.
                </p>
                <p>
                  Instead of sharing multiple links across different platforms,
                  you can create a single, beautiful profile page that showcases
                  all your social presence in one place.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <h2 className="text-2xl font-medium text-white mb-8 text-center">
                Key Features
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-all duration-300 group/feature"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <FontAwesomeIcon
                        icon={feature.icon}
                        className={`w-6 h-6 ${feature.color} group-hover/feature:scale-110 transition-transform duration-300`}
                      />
                      <h3 className="font-medium text-white">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Supported Platforms */}
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
                    <span className="text-sm text-zinc-300">
                      {platform.name}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-center text-zinc-400 text-sm">
                And many more platforms to showcase your online presence
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-transparent to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <FontAwesomeIcon
                  icon={faUser}
                  className="w-6 h-6 text-orange-400"
                />
                <h2 className="text-2xl font-medium text-white">Perfect For</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-zinc-900/30 rounded-lg border border-zinc-800">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-medium text-white mb-2">
                      🎮 Streamers & Gamers
                    </h3>
                    <p className="text-sm text-zinc-400">
                      Showcase your channels, current games, and live streaming
                      status all in one place.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-zinc-900/30 rounded-lg border border-zinc-800">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-medium text-white mb-2">
                      👥 Communities
                    </h3>
                    <p className="text-sm text-zinc-400">
                      Share your presence across multiple platforms in a
                      stylish, simple way.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-zinc-900/30 rounded-lg border border-zinc-800">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-medium text-white mb-2">
                      📱 Content Creators
                    </h3>
                    <p className="text-sm text-zinc-400">
                      Replace multiple bio links with one beautiful,
                      comprehensive profile page.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Example Use Case */}
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
                    biogg.net/username
                  </span>
                </div>

                <div className="space-y-3 text-sm text-zinc-300">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faSpotify}
                      className="w-4 h-4 text-green-400"
                    />
                    <span>
                      Currently listening to: &quot;Song Name by Artist
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
                    <span>Latest video: &quot;How to Build in Minecraft</span>
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

        <div className="mb-16">
          <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon
                  icon={faShield}
                  className="w-6 h-6 text-red-400"
                />
                <h2 className="text-2xl font-medium text-white">
                  Privacy & Security
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                  <h3 className="font-medium text-white mb-2">🔒 SSL/TLS</h3>
                  <p className="text-sm text-zinc-400">Secure data transfer</p>
                </div>

                <div className="text-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                  <h3 className="font-medium text-white mb-2">🛡️ GDPR</h3>
                  <p className="text-sm text-zinc-400">
                    Compliant data handling
                  </p>
                </div>

                <div className="text-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                  <h3 className="font-medium text-white mb-2">🔐 Secure</h3>
                  <p className="text-sm text-zinc-400">Token protection</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="relative p-8 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-medium text-white mb-4">
                Ready to Create Your Profile?
              </h2>
              <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">
                Join thousands of gamers and streamers who have already created
                their beautiful bio pages with Biogg.net
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://biogg.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 font-medium"
                >
                  <FontAwesomeIcon icon={faGlobe} className="w-5 h-5" />
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>

        <BackHome />
      </div>
    </div>
  );
}
