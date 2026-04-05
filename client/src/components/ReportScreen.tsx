/*
 * Report Screen - Full assessment results with score gauge, category bars, AI report
 * Swiss Precision: Structured report layout, data-dense, authoritative
 */
import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Download,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Target,
  Zap,
  ChevronRight,
} from "lucide-react";
import {
  type AssessmentResult,
  industryBenchmarks,
  revenueMultipliers,
  getScoreLabel,
  getScoreColor,
  getScoreDescription,
} from "@/lib/assessment-data";

const REPORT_HEADER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/91190584/6QeCpxGkLw2tLGVLLJV7cu/report-header-AhauN6xTrGSzKuTTwq4FZ2.webp";

interface ReportScreenProps {
  result: AssessmentResult;
  aiReport: string;
}

export function ReportScreen({ result, aiReport }: ReportScreenProps) {
  const { overallScore, categories, userInfo, industry, revenue } = result;
  const benchmark = industryBenchmarks[industry] || 40;
  const revNum = revenueMultipliers[revenue] || 1000000;
  const scoreLabel = getScoreLabel(overallScore);
  const scoreColor = getScoreColor(overallScore);
  const scoreDesc = getScoreDescription(overallScore);

  // Parse AI report sections
  const sections = parseAiReport(aiReport, result);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex-1 py-8 sm:py-12 px-4"
    >
      <div className="max-w-3xl mx-auto">
        {/* Report Header */}
        <div className="relative rounded-xl overflow-hidden mb-8">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url(${REPORT_HEADER_IMG})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/60" />
          <div className="relative z-10 p-6 sm:p-8">
            <p className="text-xs font-medium text-teal-400 uppercase tracking-wider mb-1">
              AI Readiness Report
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
              {userInfo.company}
            </h1>
            <p className="text-sm text-gray-500">
              Prepared for {userInfo.name} | {industry} | {revenue} revenue
            </p>
          </div>
        </div>

        {/* Score Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Score Gauge */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
              Overall AI Opportunity Score
            </p>
            <ScoreGauge score={overallScore} color={scoreColor} />
            <div className="mt-4 text-center">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: `${scoreColor}15`,
                  color: scoreColor,
                  border: `1px solid ${scoreColor}30`,
                }}
              >
                {scoreLabel} Opportunity
              </span>
              <p className="text-xs text-gray-500 mt-3 max-w-xs">{scoreDesc}</p>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 sm:p-8">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-5">
              Score Breakdown
            </p>
            <div className="space-y-4">
              {categories.map((cat, i) => (
                <CategoryBar
                  key={cat.name}
                  name={cat.name}
                  percentage={cat.percentage}
                  weight={cat.weight}
                  delay={i * 0.15}
                />
              ))}
            </div>

            {/* Benchmark */}
            <div className="mt-6 pt-5 border-t border-white/5">
              <p className="text-xs text-gray-500 mb-2">Industry Benchmark</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">Your score</span>
                    <span className="text-white font-semibold font-['Space_Grotesk']">{overallScore}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-teal-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${overallScore}%` }}
                      transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">{industry} avg</span>
                    <span className="text-gray-500 font-['Space_Grotesk']">{benchmark}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white/20 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${benchmark}%` }}
                      transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
              {overallScore > benchmark && (
                <p className="text-xs text-teal-400 mt-2">
                  Your AI opportunity is {overallScore - benchmark} points above industry average
                </p>
              )}
            </div>
          </div>
        </div>

        {/* AI-Generated Report Sections */}
        {sections.revenueLeaks.length > 0 && (
          <ReportSection
            icon={<AlertTriangle className="w-4 h-4" />}
            title="Top Revenue Leaks"
            subtitle="Identified opportunities costing your business"
            delay={0.2}
          >
            <div className="space-y-3">
              {sections.revenueLeaks.map((leak, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-red-500/[0.04] border border-red-500/10 rounded-lg"
                >
                  <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-red-400 font-['Space_Grotesk']">{i + 1}</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{leak}</p>
                </div>
              ))}
            </div>
          </ReportSection>
        )}

        {sections.roadmap.length > 0 && (
          <ReportSection
            icon={<Target className="w-4 h-4" />}
            title="30/60/90 Day AI Implementation Roadmap"
            subtitle="Your personalized path to AI-powered growth"
            delay={0.3}
          >
            <div className="space-y-4">
              {sections.roadmap.map((phase, i) => (
                <div key={i} className="relative pl-6 border-l border-teal-500/20">
                  <div className="absolute left-0 top-0 w-2.5 h-2.5 rounded-full bg-teal-500 -translate-x-[5.5px]" />
                  <p className="text-sm text-gray-300 leading-relaxed">{phase}</p>
                </div>
              ))}
            </div>
          </ReportSection>
        )}

        {sections.roi && (
          <ReportSection
            icon={<TrendingUp className="w-4 h-4" />}
            title="Estimated Annual ROI"
            subtitle="Projected return from AI implementation"
            delay={0.4}
          >
            <div className="p-4 bg-teal-500/[0.04] border border-teal-500/10 rounded-lg">
              <p className="text-sm text-gray-300 leading-relaxed">{sections.roi}</p>
            </div>
          </ReportSection>
        )}

        {sections.quickWins.length > 0 && (
          <ReportSection
            icon={<Zap className="w-4 h-4" />}
            title="Priority Matrix"
            subtitle="Quick wins vs strategic plays"
            delay={0.5}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-teal-400 uppercase tracking-wider mb-3">
                  Quick Wins (This Week)
                </p>
                <div className="space-y-2">
                  {sections.quickWins.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-teal-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-400">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Strategic Plays (90 Days)
                </p>
                <div className="space-y-2">
                  {sections.strategicPlays.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-gray-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-500">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ReportSection>
        )}

        {/* Fallback if no AI report */}
        {!aiReport && (
          <FallbackReport result={result} revNum={revNum} />
        )}

        {/* CTA Section */}
        <div className="mt-10 p-6 sm:p-8 bg-gradient-to-br from-teal-500/10 to-teal-500/[0.02] border border-teal-500/20 rounded-xl text-center">
          <h3 className="text-lg font-bold text-white mb-2">
            Ready to unlock your AI potential?
          </h3>
          <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
            Get a personalized strategy session to discuss your results and build your implementation plan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://calendly.com/loshustle"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-[#0a0a0a] font-semibold text-sm rounded-lg transition-all duration-200"
            >
              <Calendar className="w-4 h-4" />
              Book a Free Strategy Call
            </a>
            <button
              onClick={() => downloadReport(result, sections, aiReport)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium text-sm rounded-lg border border-white/10 transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              Download Report as PDF
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* Score Gauge Component */
function ScoreGauge({ score, color }: { score: number; color: string }) {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  useEffect(() => {
    const duration = 2000;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div className="relative w-48 h-48">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="8"
        />
        {/* Score arc */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="animate-gauge-fill"
          style={{
            transition: "stroke-dashoffset 2s ease-out",
          }}
        />
        {/* Glow */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          opacity="0.3"
          filter="blur(4px)"
          style={{
            transition: "stroke-dashoffset 2s ease-out",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-5xl font-bold font-['Space_Grotesk'] tabular-nums"
          style={{ color }}
        >
          {displayScore}
        </span>
        <span className="text-xs text-gray-500 mt-1">out of 100</span>
      </div>
    </div>
  );
}

/* Category Bar Component */
function CategoryBar({
  name,
  percentage,
  weight,
  delay,
}: {
  name: string;
  percentage: number;
  weight: number;
  delay: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-gray-400">
          {name}{" "}
          <span className="text-gray-600">({Math.round(weight * 100)}% weight)</span>
        </span>
        <span className="text-white font-semibold font-['Space_Grotesk'] tabular-nums">
          {percentage}%
        </span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, #0d9488, #14b8a6)`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.3 + delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* Report Section Wrapper */
function ReportSection({
  icon,
  title,
  subtitle,
  delay,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 sm:p-8 mb-6"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="text-teal-400">{icon}</div>
        <h3 className="text-base font-bold text-white">{title}</h3>
      </div>
      <p className="text-xs text-gray-500 mb-5">{subtitle}</p>
      {children}
    </motion.div>
  );
}

/* Parse AI report into structured sections */
interface ParsedSections {
  revenueLeaks: string[];
  roadmap: string[];
  roi: string;
  quickWins: string[];
  strategicPlays: string[];
}

function parseAiReport(report: string, result: AssessmentResult): ParsedSections {
  const empty: ParsedSections = {
    revenueLeaks: [],
    roadmap: [],
    roi: "",
    quickWins: [],
    strategicPlays: [],
  };

  if (!report) return empty;

  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(report);
    return {
      revenueLeaks: parsed.revenueLeaks || parsed.revenue_leaks || [],
      roadmap: parsed.roadmap || [],
      roi: parsed.roi || parsed.estimatedROI || "",
      quickWins: parsed.quickWins || parsed.quick_wins || [],
      strategicPlays: parsed.strategicPlays || parsed.strategic_plays || [],
    };
  } catch {
    // Parse as text sections
    const sections = extractSections(report);
    return sections;
  }
}

function extractSections(text: string): ParsedSections {
  const result: ParsedSections = {
    revenueLeaks: [],
    roadmap: [],
    roi: "",
    quickWins: [],
    strategicPlays: [],
  };

  // Split by common section markers
  const lines = text.split("\n").filter((l) => l.trim());

  let currentSection = "";
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes("revenue leak") || lower.includes("top 3")) {
      currentSection = "leaks";
      continue;
    }
    if (lower.includes("roadmap") || lower.includes("30/60/90") || lower.includes("implementation")) {
      currentSection = "roadmap";
      continue;
    }
    if (lower.includes("roi") || lower.includes("return on investment") || lower.includes("estimated annual")) {
      currentSection = "roi";
      continue;
    }
    if (lower.includes("quick win")) {
      currentSection = "quickWins";
      continue;
    }
    if (lower.includes("strategic") || lower.includes("90-day") || lower.includes("90 day")) {
      currentSection = "strategic";
      continue;
    }

    const cleaned = line.replace(/^[-*\d.)\s]+/, "").trim();
    if (!cleaned) continue;

    switch (currentSection) {
      case "leaks":
        if (result.revenueLeaks.length < 3) result.revenueLeaks.push(cleaned);
        break;
      case "roadmap":
        if (result.roadmap.length < 6) result.roadmap.push(cleaned);
        break;
      case "roi":
        result.roi += (result.roi ? " " : "") + cleaned;
        break;
      case "quickWins":
        if (result.quickWins.length < 4) result.quickWins.push(cleaned);
        break;
      case "strategic":
        if (result.strategicPlays.length < 4) result.strategicPlays.push(cleaned);
        break;
    }
  }

  return result;
}

/* Fallback report when API fails */
function FallbackReport({ result, revNum }: { result: AssessmentResult; revNum: number }) {
  const leakAmount1 = Math.round(revNum * 0.08);
  const leakAmount2 = Math.round(revNum * 0.05);
  const leakAmount3 = Math.round(revNum * 0.03);
  const totalROI = Math.round(revNum * 0.15);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <ReportSection
        icon={<AlertTriangle className="w-4 h-4" />}
        title="Top Revenue Leaks"
        subtitle="Identified opportunities costing your business"
        delay={0.2}
      >
        <div className="space-y-3">
          {[
            `Slow lead response time is costing you an estimated ${formatCurrency(leakAmount1)}/year in lost conversions. Businesses that respond within 5 minutes are 21x more likely to close.`,
            `Manual processes are consuming ${formatCurrency(leakAmount2)}/year in labor costs that could be automated with AI workflows and intelligent routing.`,
            `Inconsistent customer follow-up is resulting in approximately ${formatCurrency(leakAmount3)}/year in preventable churn and missed upsell opportunities.`,
          ].map((leak, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 bg-red-500/[0.04] border border-red-500/10 rounded-lg"
            >
              <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-red-400 font-['Space_Grotesk']">{i + 1}</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{leak}</p>
            </div>
          ))}
        </div>
      </ReportSection>

      <ReportSection
        icon={<Target className="w-4 h-4" />}
        title="30/60/90 Day AI Implementation Roadmap"
        subtitle="Your personalized path to AI-powered growth"
        delay={0.3}
      >
        <div className="space-y-4">
          {[
            "Days 1-30: Deploy AI-powered lead response system to capture and qualify leads within 60 seconds, 24/7. Set up automated follow-up sequences.",
            "Days 31-60: Implement AI content generation and customer communication workflows. Automate scheduling, data entry, and routine admin tasks.",
            "Days 61-90: Launch predictive analytics for customer behavior. Optimize sales process with AI-driven insights and automated reporting dashboards.",
          ].map((phase, i) => (
            <div key={i} className="relative pl-6 border-l border-teal-500/20">
              <div className="absolute left-0 top-0 w-2.5 h-2.5 rounded-full bg-teal-500 -translate-x-[5.5px]" />
              <p className="text-sm text-gray-300 leading-relaxed">{phase}</p>
            </div>
          ))}
        </div>
      </ReportSection>

      <ReportSection
        icon={<TrendingUp className="w-4 h-4" />}
        title="Estimated Annual ROI"
        subtitle="Projected return from AI implementation"
        delay={0.4}
      >
        <div className="p-4 bg-teal-500/[0.04] border border-teal-500/10 rounded-lg">
          <p className="text-sm text-gray-300 leading-relaxed">
            Based on your {result.revenue} revenue and current operational gaps, implementing AI across your key bottlenecks could generate an estimated <span className="text-teal-400 font-semibold">{formatCurrency(totalROI)}</span> in annual savings and revenue growth. This includes reduced labor costs, improved conversion rates, and decreased customer churn.
          </p>
        </div>
      </ReportSection>

      <ReportSection
        icon={<Zap className="w-4 h-4" />}
        title="Priority Matrix"
        subtitle="Quick wins vs strategic plays"
        delay={0.5}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-teal-400 uppercase tracking-wider mb-3">
              Quick Wins (This Week)
            </p>
            <div className="space-y-2">
              {[
                "Set up AI chatbot for instant lead response",
                "Automate email follow-up sequences",
                "Deploy AI scheduling assistant",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-teal-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-400">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Strategic Plays (90 Days)
            </p>
            <div className="space-y-2">
              {[
                "Build AI-powered sales pipeline optimization",
                "Implement predictive customer churn model",
                "Deploy automated content generation system",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-500">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ReportSection>
    </>
  );
}

/* Download Report as text file (PDF-like formatted text) */
function downloadReport(
  result: AssessmentResult,
  sections: ParsedSections,
  aiReport: string
) {
  const { overallScore, categories, userInfo, industry, revenue } = result;
  const benchmark = industryBenchmarks[industry] || 40;
  const revNum = revenueMultipliers[revenue] || 1000000;
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  let text = `
AI READINESS ASSESSMENT REPORT
================================

Prepared for: ${userInfo.name}
Company: ${userInfo.company}
Industry: ${industry}
Revenue: ${revenue}
Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}

OVERALL AI OPPORTUNITY SCORE: ${overallScore}/100
${getScoreLabel(overallScore)} Opportunity
${getScoreDescription(overallScore)}

SCORE BREAKDOWN
---------------
${categories.map((c) => `${c.name}: ${c.percentage}% (${Math.round(c.weight * 100)}% weight)`).join("\n")}

INDUSTRY BENCHMARK
------------------
Your Score: ${overallScore}
${industry} Average: ${benchmark}
`;

  if (sections.revenueLeaks.length > 0) {
    text += `\nTOP REVENUE LEAKS\n-----------------\n`;
    sections.revenueLeaks.forEach((leak, i) => {
      text += `${i + 1}. ${leak}\n`;
    });
  } else {
    text += `\nTOP REVENUE LEAKS\n-----------------\n`;
    text += `1. Slow lead response time - est. ${formatCurrency(Math.round(revNum * 0.08))}/year\n`;
    text += `2. Manual processes - est. ${formatCurrency(Math.round(revNum * 0.05))}/year\n`;
    text += `3. Inconsistent follow-up - est. ${formatCurrency(Math.round(revNum * 0.03))}/year\n`;
  }

  if (sections.roadmap.length > 0) {
    text += `\n30/60/90 DAY ROADMAP\n--------------------\n`;
    sections.roadmap.forEach((phase) => {
      text += `- ${phase}\n`;
    });
  }

  if (sections.roi) {
    text += `\nESTIMATED ANNUAL ROI\n--------------------\n${sections.roi}\n`;
  } else {
    text += `\nESTIMATED ANNUAL ROI\n--------------------\nEstimated ${formatCurrency(Math.round(revNum * 0.15))}/year from AI implementation\n`;
  }

  text += `\n\nPowered by ELIOS | LosSilva.com\nBook your free strategy call: calendly.com/loshustle\n`;

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `AI-Readiness-Report-${userInfo.company.replace(/\s+/g, "-")}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
