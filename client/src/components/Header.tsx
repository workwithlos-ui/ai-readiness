import { motion } from "framer-motion";

interface HeaderProps {
  progress: number;
  showProgress: boolean;
}

export function Header({ progress, showProgress }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-teal-400">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">AI Readiness</span>
        </div>

        {showProgress && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-500 tabular-nums font-['Space_Grotesk']">
              {Math.round(progress)}%
            </span>
            <div className="w-32 sm:w-48 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-teal-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
