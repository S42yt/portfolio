import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

export default function ConfigurationSection() {
  return (
    <div className="mb-16">
      <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <FontAwesomeIcon
              icon={faCog}
              className="w-6 h-6 text-purple-400"
            />
            <h2 className="text-2xl font-medium text-white">Configuration</h2>
          </div>

          <div className="space-y-4">
            <p className="text-zinc-300">
              You can configure which method (or both) should be used to cycle
              through trades:
            </p>

            <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm">
              <pre className="text-zinc-300">
                {`strategy:
  - KEYBOARD
# - SHIFT_INTERACT`}
              </pre>
            </div>

            <p className="text-zinc-400 text-sm">
              &apos;#&apos; in front of a method will disable it. The
              SHIFT_INTERACT was made with Bedrock and Geyser in mind so you can
              also cycle trades on the bedrock edition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}