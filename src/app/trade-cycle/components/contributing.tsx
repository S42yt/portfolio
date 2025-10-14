import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

export default function ContributingSection() {
  return (
    <div className="mb-16">
      <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 via-transparent to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-pink-400" />
            <h2 className="text-2xl font-medium text-white">Contributing 🩷</h2>
          </div>

          <div className="space-y-4 text-zinc-300">
            <p>
              Feel free to open an issue or a pull request, I will be happy to
              help you!
            </p>

            <div>
              <h3 className="text-lg font-medium text-white mb-2">
                Special thanks to contributors:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-zinc-400">
                <li>
                  <a
                    href="https://github.com/tamikaschu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Tamikaschu
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
