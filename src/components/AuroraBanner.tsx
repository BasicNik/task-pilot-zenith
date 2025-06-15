
import React from "react";
import { X } from "lucide-react";

const GITHUB_URL = "https://github.com/BasicNik";

const AuroraBanner: React.FC = () => {
  const [show, setShow] = React.useState(true);
  if (!show) return null;

  return (
    <div className="relative z-50 isolate flex items-center gap-x-6 overflow-hidden rounded-b-xl border-b border-white/[0.11] aurora-banner-gradient px-4 py-2.5 sm:py-2.5 sm:px-6 backdrop-blur-sm shadow-md animate-fade-in sticky top-0">
      {/* Aurora blur effects (decorative, optional) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full"
        style={{
          background: "linear-gradient(90deg, #f4b5fd 0%, #fd6a6a 40%, #fd8a4a 70%, #bc13fe 100%)",
          opacity: 0.18,
        }}
      />
      {/* Aurora spot effect (optional): */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 -z-10 w-full h-full blur-2xl opacity-50"
        style={{
          background: "radial-gradient(ellipse 55% 70% at 50% 50%, #fd8a4a55 0%, #da4af700 100%)"
        }}
      />
      {/* Content & Button */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="text-base text-gray-900 dark:text-white font-semibold">
          TaskPilot 2025
        </span>
        <span className="hidden sm:inline-block text-sm text-gray-900/80 dark:text-white/80">
          {"· Star this repository if you like and follow me on GitHub."}
        </span>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-none rounded-full bg-gray-900 aurora-glow px-4 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-gray-700/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition hover:scale-[1.05]"
        >
          Follow @BasicNik <span aria-hidden="true" className="ml-1">&rarr;</span>
        </a>
      </div>
      <div className="flex flex-1 justify-end">
        <button
          type="button"
          aria-label="Dismiss"
          className="-m-3 p-3 text-gray-900 dark:text-white transition hover:opacity-70"
          onClick={() => setShow(false)}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default AuroraBanner;
