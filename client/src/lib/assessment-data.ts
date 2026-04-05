// ============================================================
// AI Readiness Assessment - Data Model & Scoring Engine
// Design: Swiss Precision - clean, authoritative, data-driven
// ============================================================

export interface Option {
  label: string;
  value: string;
  score: number;
}

export interface Question {
  id: number;
  text: string;
  type: "single" | "multi-select" | "dropdown";
  options: Option[];
  category: "basics" | "operations" | "technology" | "growth" | "readiness";
}

export interface Screen {
  id: number;
  title: string;
  subtitle: string;
  questions: Question[];
}

export interface UserInfo {
  name: string;
  email: string;
  company: string;
}

export interface AssessmentAnswers {
  [questionId: number]: string | string[];
}

export interface CategoryScore {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  weight: number;
}

export interface AssessmentResult {
  overallScore: number;
  categories: CategoryScore[];
  answers: AssessmentAnswers;
  userInfo: UserInfo;
  industry: string;
  revenue: string;
  employees: string;
}

// Industry benchmarks (average scores out of 100)
export const industryBenchmarks: Record<string, number> = {
  "Home Services": 32,
  "DTC/Ecommerce": 55,
  "Professional Services": 41,
  "Healthcare": 38,
  "Real Estate": 35,
  "Marketing/Agency": 52,
  "Manufacturing": 29,
  "Other": 40,
};

// Revenue multipliers for dollar estimates
export const revenueMultipliers: Record<string, number> = {
  "Under $500K": 350000,
  "$500K-$1M": 750000,
  "$1M-$3M": 2000000,
  "$3M-$5M": 4000000,
  "$5M-$10M": 7500000,
  "$10M-$25M": 17500000,
  "$25M-$50M": 37500000,
  "$50M+": 75000000,
};

export const screens: Screen[] = [
  {
    id: 1,
    title: "Business Basics",
    subtitle: "Tell us about your company",
    questions: [
      {
        id: 1,
        text: "What industry are you in?",
        type: "dropdown",
        category: "basics",
        options: [
          { label: "Home Services", value: "Home Services", score: 0 },
          { label: "DTC/Ecommerce", value: "DTC/Ecommerce", score: 0 },
          { label: "Professional Services", value: "Professional Services", score: 0 },
          { label: "Healthcare", value: "Healthcare", score: 0 },
          { label: "Real Estate", value: "Real Estate", score: 0 },
          { label: "Marketing/Agency", value: "Marketing/Agency", score: 0 },
          { label: "Manufacturing", value: "Manufacturing", score: 0 },
          { label: "Other", value: "Other", score: 0 },
        ],
      },
      {
        id: 2,
        text: "What is your annual revenue?",
        type: "dropdown",
        category: "basics",
        options: [
          { label: "Under $500K", value: "Under $500K", score: 0 },
          { label: "$500K - $1M", value: "$500K-$1M", score: 0 },
          { label: "$1M - $3M", value: "$1M-$3M", score: 0 },
          { label: "$3M - $5M", value: "$3M-$5M", score: 0 },
          { label: "$5M - $10M", value: "$5M-$10M", score: 0 },
          { label: "$10M - $25M", value: "$10M-$25M", score: 0 },
          { label: "$25M - $50M", value: "$25M-$50M", score: 0 },
          { label: "$50M+", value: "$50M+", score: 0 },
        ],
      },
      {
        id: 3,
        text: "How many employees do you have?",
        type: "dropdown",
        category: "basics",
        options: [
          { label: "1 - 5", value: "1-5", score: 0 },
          { label: "6 - 15", value: "6-15", score: 0 },
          { label: "16 - 50", value: "16-50", score: 0 },
          { label: "51 - 100", value: "51-100", score: 0 },
          { label: "100+", value: "100+", score: 0 },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Operations",
    subtitle: "How your business runs day to day",
    questions: [
      {
        id: 4,
        text: "How do you currently handle incoming leads/calls?",
        type: "single",
        category: "operations",
        options: [
          { label: "Automated system", value: "Automated system", score: 2 },
          { label: "Basic CRM", value: "Basic CRM", score: 5 },
          { label: "Manual/phone", value: "Manual/phone", score: 8 },
          { label: "We miss a lot of them", value: "We miss a lot of them", score: 10 },
        ],
      },
      {
        id: 5,
        text: "What is your average response time to new leads?",
        type: "single",
        category: "operations",
        options: [
          { label: "Under 5 minutes", value: "Under 5 minutes", score: 2 },
          { label: "5 - 30 minutes", value: "5-30 minutes", score: 4 },
          { label: "30 min - 2 hours", value: "30 min - 2 hours", score: 6 },
          { label: "2 - 24 hours", value: "2-24 hours", score: 8 },
          { label: "Over 24 hours", value: "Over 24 hours", score: 10 },
        ],
      },
      {
        id: 6,
        text: "How many manual/repetitive processes does your team do daily?",
        type: "single",
        category: "operations",
        options: [
          { label: "1 - 3", value: "1-3", score: 2 },
          { label: "4 - 7", value: "4-7", score: 5 },
          { label: "8 - 15", value: "8-15", score: 8 },
          { label: "15+", value: "15+", score: 10 },
          { label: "I don't know", value: "I don't know", score: 7 },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Technology",
    subtitle: "Your current tech stack and AI experience",
    questions: [
      {
        id: 7,
        text: "What tools do you currently use?",
        type: "multi-select",
        category: "technology",
        options: [
          { label: "CRM", value: "CRM", score: -1 },
          { label: "Email marketing", value: "Email marketing", score: -1 },
          { label: "Social media scheduler", value: "Social media scheduler", score: -1 },
          { label: "Accounting software", value: "Accounting software", score: -1 },
          { label: "Project management", value: "Project management", score: -1 },
          { label: "AI tools", value: "AI tools", score: -2 },
          { label: "None of the above", value: "None of the above", score: 10 },
        ],
      },
      {
        id: 8,
        text: "Have you tried implementing AI before?",
        type: "single",
        category: "technology",
        options: [
          { label: "Yes, successfully", value: "Yes successfully", score: 2 },
          { label: "Yes, but it failed", value: "Yes but it failed", score: 8 },
          { label: "No, but interested", value: "No but interested", score: 6 },
          { label: "No, and not interested", value: "No and not interested", score: 3 },
        ],
      },
      {
        id: 9,
        text: "What is your biggest operational bottleneck?",
        type: "single",
        category: "technology",
        options: [
          { label: "Lead response time", value: "Lead response time", score: 9 },
          { label: "Content creation", value: "Content creation", score: 7 },
          { label: "Customer follow-up", value: "Customer follow-up", score: 8 },
          { label: "Scheduling/booking", value: "Scheduling/booking", score: 6 },
          { label: "Data entry/admin", value: "Data entry/admin", score: 8 },
          { label: "Sales process", value: "Sales process", score: 9 },
          { label: "Other", value: "Other", score: 5 },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Growth",
    subtitle: "Your acquisition and retention metrics",
    questions: [
      {
        id: 10,
        text: "What is your customer acquisition cost?",
        type: "single",
        category: "growth",
        options: [
          { label: "Under $50", value: "Under $50", score: 3 },
          { label: "$50 - $200", value: "$50-$200", score: 5 },
          { label: "$200 - $500", value: "$200-$500", score: 7 },
          { label: "$500 - $1,000", value: "$500-$1,000", score: 9 },
          { label: "Over $1,000", value: "Over $1,000", score: 10 },
          { label: "I don't know", value: "I don't know", score: 8 },
        ],
      },
      {
        id: 11,
        text: "What is your monthly customer churn rate?",
        type: "single",
        category: "growth",
        options: [
          { label: "Under 2%", value: "Under 2%", score: 2 },
          { label: "2 - 5%", value: "2-5%", score: 5 },
          { label: "5 - 10%", value: "5-10%", score: 8 },
          { label: "Over 10%", value: "Over 10%", score: 10 },
          { label: "I don't know", value: "I don't know", score: 7 },
        ],
      },
      {
        id: 12,
        text: "What is your current close rate on leads?",
        type: "single",
        category: "growth",
        options: [
          { label: "Under 10%", value: "Under 10%", score: 10 },
          { label: "10 - 20%", value: "10-20%", score: 7 },
          { label: "20 - 35%", value: "20-35%", score: 5 },
          { label: "35 - 50%", value: "35-50%", score: 3 },
          { label: "Over 50%", value: "Over 50%", score: 1 },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Readiness",
    subtitle: "Your capacity and urgency for AI adoption",
    questions: [
      {
        id: 13,
        text: "How much time does your team spend on tasks that could be automated?",
        type: "single",
        category: "readiness",
        options: [
          { label: "Less than 5 hours/week", value: "Less than 5 hours/week", score: 3 },
          { label: "5 - 15 hours/week", value: "5-15 hours/week", score: 6 },
          { label: "15 - 30 hours/week", value: "15-30 hours/week", score: 8 },
          { label: "30+ hours/week", value: "30+ hours/week", score: 10 },
        ],
      },
      {
        id: 14,
        text: "What would a 20% increase in efficiency mean for your bottom line?",
        type: "single",
        category: "readiness",
        options: [
          { label: "Under $50K/year", value: "Under $50K/year", score: 3 },
          { label: "$50K - $100K", value: "$50K-$100K", score: 5 },
          { label: "$100K - $250K", value: "$100K-$250K", score: 7 },
          { label: "$250K - $500K", value: "$250K-$500K", score: 9 },
          { label: "Over $500K", value: "Over $500K", score: 10 },
        ],
      },
      {
        id: 15,
        text: "How quickly do you want to see results from AI?",
        type: "single",
        category: "readiness",
        options: [
          { label: "30 days", value: "30 days", score: 10 },
          { label: "60 days", value: "60 days", score: 8 },
          { label: "90 days", value: "90 days", score: 6 },
          { label: "6 months", value: "6 months", score: 4 },
          { label: "I'm just exploring", value: "I'm just exploring", score: 2 },
        ],
      },
    ],
  },
];

// Category weights
const categoryWeights: Record<string, number> = {
  operations: 0.30,
  technology: 0.20,
  growth: 0.25,
  readiness: 0.25,
};

// Calculate score for multi-select question 7
function calculateMultiSelectScore(selected: string[], options: Option[]): number {
  if (selected.includes("None of the above")) return 10;
  // More tools = lower score (less opportunity). Score = 10 - (tools * 1.5), min 1
  const toolCount = selected.length;
  return Math.max(1, Math.round(10 - toolCount * 1.5));
}

export function calculateScores(answers: AssessmentAnswers): {
  overallScore: number;
  categories: CategoryScore[];
} {
  const categoryScores: Record<string, { total: number; max: number; count: number }> = {
    operations: { total: 0, max: 0, count: 0 },
    technology: { total: 0, max: 0, count: 0 },
    growth: { total: 0, max: 0, count: 0 },
    readiness: { total: 0, max: 0, count: 0 },
  };

  for (const screen of screens) {
    for (const question of screen.questions) {
      if (question.category === "basics") continue;

      const answer = answers[question.id];
      if (!answer) continue;

      let score = 0;
      if (question.type === "multi-select" && Array.isArray(answer)) {
        score = calculateMultiSelectScore(answer, question.options);
      } else {
        const selectedOption = question.options.find((o) => o.value === answer);
        score = selectedOption?.score ?? 0;
      }

      categoryScores[question.category].total += score;
      categoryScores[question.category].max += 10;
      categoryScores[question.category].count += 1;
    }
  }

  const categories: CategoryScore[] = Object.entries(categoryScores).map(
    ([key, val]) => {
      const percentage = val.max > 0 ? (val.total / val.max) * 100 : 0;
      return {
        name: key.charAt(0).toUpperCase() + key.slice(1),
        score: val.total,
        maxScore: val.max,
        percentage: Math.round(percentage),
        weight: categoryWeights[key],
      };
    }
  );

  // Weighted overall score
  let weightedSum = 0;
  let totalWeight = 0;
  for (const cat of categories) {
    weightedSum += (cat.percentage / 100) * cat.weight;
    totalWeight += cat.weight;
  }
  const overallScore = Math.round((weightedSum / totalWeight) * 100);

  return { overallScore, categories };
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 40) return "Moderate";
  if (score >= 20) return "Low";
  return "Minimal";
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#ef4444";
  if (score >= 60) return "#f97316";
  if (score >= 40) return "#eab308";
  if (score >= 20) return "#22c55e";
  return "#06b6d4";
}

export function getScoreDescription(score: number): string {
  if (score >= 80) return "Your business has massive untapped AI potential. Immediate action could transform your operations.";
  if (score >= 60) return "Significant opportunities exist to leverage AI across your operations. A structured approach will yield strong ROI.";
  if (score >= 40) return "Your business has moderate AI readiness. Targeted implementations in key areas will drive meaningful results.";
  if (score >= 20) return "You have some foundations in place. Strategic AI adoption in specific areas will enhance your competitive edge.";
  return "Your operations are relatively optimized. Focused AI applications can still drive incremental improvements.";
}
