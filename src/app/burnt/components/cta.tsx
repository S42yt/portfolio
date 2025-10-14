import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

export default function CTASection() {
  return (
    <div className="mb-16">
      <div className="relative p-8 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-medium text-white mb-4">
            Ready to Create Your Profile?
          </h2>
          <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">
            Join thousands of gamers and streamers who have already created
            their beautiful bio pages with Burnt.net
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://burnt.rip"
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
  );
}
