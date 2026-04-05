/*
 * Hero Screen - Landing page for the AI Readiness Assessment
 * Swiss Precision: Clean typography, generous whitespace, single teal accent
 */
import { motion } from "framer-motion";
import { ArrowRight, Clock, BarChart3, Zap } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/91190584/6QeCpxGkLw2tLGVLLJV7cu/hero-bg-mdpzNDZaeAGpFuMsyTy3TT.webp";

interface HeroScreenProps {
  onStart: () => void;
}

export function HeroScreen({ onStart }: HeroScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col"
    >
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center py-20 sm:py-28 overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url(${HERO_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/60 to-[#0a0a0a]" />

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs font-medium text-teal-400 tracking-wide uppercase">Free Diagnostic Tool</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-5"
          >
            AI Readiness
            <br />
            <span className="text-teal-400">Assessment</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-base sm:text-lg text-gray-400 max-w-lg mx-auto mb-10 leading-relaxed"
          >
            Discover your AI implementation score in 3 minutes. Get a personalized report with revenue opportunities and a 90-day roadmap.
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            onClick={onStart}
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-teal-500 hover:bg-teal-400 text-[#0a0a0a] font-semibold text-sm rounded-lg transition-all duration-200 shadow-lg shadow-teal-500/20 hover:shadow-teal-400/30"
          >
            Start Your Assessment
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8"
          >
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-3.5 h-3.5 text-teal-500/60" />
              <span className="text-xs">3 minutes</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <BarChart3 className="w-3.5 h-3.5 text-teal-500/60" />
              <span className="text-xs">Personalized report</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Zap className="w-3.5 h-3.5 text-teal-500/60" />
              <span className="text-xs">Actionable insights</span>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
