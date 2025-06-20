import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface Contribution {
  icon: IconDefinition;
  title: string;
  description: string;
  color: string;
}

interface MyRoleSectionProps {
  contributions: Contribution[];
}

export default function MyRoleSection({ contributions }: MyRoleSectionProps) {
  return (
    <div className="mb-16">
      <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <FontAwesomeIcon
              icon={faUsers}
              className="w-6 h-6 text-cyan-400"
            />
            <h2 className="text-2xl font-medium text-white">
              My Role at CuteCraft
            </h2>
          </div>

          <div className="space-y-4 text-zinc-300 mb-8">
            <p>
              As a core member of the CuteCraft development team, I focus
              primarily on the
              <strong className="text-white"> web development</strong> and{' '}
              <strong className="text-white">design aspects</strong> of the
              network. My work spans across multiple areas to ensure players
              have the best possible experience both in-game and on our web
              platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contributions.map((contribution, index) => (
              <div
                key={index}
                className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-all duration-300 group/item"
              >
                <div className="flex items-center gap-3 mb-3">
                  <FontAwesomeIcon
                    icon={contribution.icon}
                    className={`w-6 h-6 ${contribution.color} group-hover/item:scale-110 transition-transform duration-300`}
                  />
                  <h3 className="font-medium text-white">
                    {contribution.title}
                  </h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {contribution.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}