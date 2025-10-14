import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function ContactSection() {
  return (
    <div className="mb-16">
      <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-transparent to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="w-6 h-6 text-green-400"
            />
            <h2 className="text-2xl font-medium text-white">Get In Touch</h2>
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href="https://discord.com/users/787306646417571860"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-blue-400 transition-colors duration-300 group/link"
            >
              <FontAwesomeIcon
                icon={faDiscord}
                className="w-5 h-5 group-hover/link:scale-110 transition-transform duration-300"
              />
              <span>Discord</span>
            </a>

            <a
              href="https://github.com/S42yt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-gray-300 transition-colors duration-300 group/link"
            >
              <FontAwesomeIcon
                icon={faGithub}
                className="w-5 h-5 group-hover/link:scale-110 transition-transform duration-300"
              />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
