import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

interface Download {
  name: string;
  url: string;
  description: string;
}

interface DownloadSectionProps {
  downloads: Download[];
}

export default function DownloadSection({ downloads }: DownloadSectionProps) {
  return (
    <div className="mb-16">
      <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <FontAwesomeIcon
              icon={faDownload}
              className="w-6 h-6 text-emerald-400"
            />
            <h2 className="text-2xl font-medium text-white">Download</h2>
          </div>

          <p className="text-zinc-300 mb-6">
            You can download the plugin from the following sources:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {downloads.map((download, index) => (
              <a
                key={index}
                href={download.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-all duration-300 group/link"
              >
                <FontAwesomeIcon
                  icon={faDownload}
                  className="w-5 h-5 text-emerald-400 group-hover/link:scale-110 transition-transform duration-300"
                />
                <div>
                  <h3 className="font-medium text-white">{download.name}</h3>
                  <p className="text-sm text-zinc-400">
                    {download.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}