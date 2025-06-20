import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export default function PerfectForSection() {
  return (
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
  );
}