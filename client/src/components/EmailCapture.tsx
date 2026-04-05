/*
 * Email Capture - Lead generation form before showing results
 * Swiss Precision: Clean form, minimal fields, clear value proposition
 */
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import type { UserInfo } from "@/lib/assessment-data";

interface EmailCaptureProps {
  onSubmit: (info: UserInfo) => void;
  onBack: () => void;
}

export function EmailCapture({ onSubmit, onBack }: EmailCaptureProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  const isValid = name.trim() && email.trim() && email.includes("@") && company.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({ name: name.trim(), email: email.trim(), company: company.trim() });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex items-center justify-center py-10 sm:py-16 px-4"
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-400">
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
            Your report is ready
          </h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Enter your details to receive your personalized AI Readiness Report with actionable insights and ROI projections.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Smith"
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-teal-500/40 focus:bg-teal-500/[0.03] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
              Work Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@company.com"
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-teal-500/40 focus:bg-teal-500/[0.03] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
              Company Name
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Corp"
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-teal-500/40 focus:bg-teal-500/[0.03] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-500 hover:bg-teal-400 disabled:bg-gray-800 disabled:text-gray-600 text-[#0a0a0a] disabled:cursor-not-allowed font-semibold text-sm rounded-lg transition-all duration-200 mt-6"
          >
            Get My Report
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Trust */}
        <div className="flex items-center justify-center gap-1.5 mt-5">
          <Lock className="w-3 h-3 text-gray-600" />
          <span className="text-xs text-gray-600">Your information is secure and never shared</span>
        </div>

        {/* Back */}
        <div className="text-center mt-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to questions
          </button>
        </div>
      </div>
    </motion.div>
  );
}
