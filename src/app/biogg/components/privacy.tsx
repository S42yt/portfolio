import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShield } from '@fortawesome/free-solid-svg-icons';

export default function PrivacySecuritySection() {
  return (
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
  );
}