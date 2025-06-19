import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import BackHome from "@/components/backHome";

export default function ContactPage() {
  return (
    <div className="relative z-10 center flex flex-col items-center justify-center min-h-screen py-20 px-6">
      <div className="flex items-center gap-3 mb-4">
        <FontAwesomeIcon icon={faEnvelope} className="w-6 h-6 text-green-400" />
        <h2 className="text-2xl font-medium text-white">Get In Touch</h2>
      </div>

      <div className="flex flex-wrap gap-4 mb-16">
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
        <BackHome />
    </div>
  );
}
