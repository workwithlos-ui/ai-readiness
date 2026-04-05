// Vercel Serverless Function: /api/generate-report
// Calls OpenAI gpt-4.1-mini to generate personalized AI readiness report

interface AssessmentResult {
  overallScore: number;
  categories: { name: string; percentage: number; weight: number }[];
  answers: Record<number, string | string[]>;
  userInfo: { name: string; email: string; company: string };
  industry: string;
  revenue: string;
  employees: string;
}

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body: AssessmentResult = await req.json();
    const { overallScore, categories, answers, userInfo, industry, revenue, employees } = body;

    const apiKey = process.env.OPENAI_API_KEY;
    const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const prompt = buildPrompt(body);

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: `You are an elite AI strategy consultant who creates personalized AI readiness reports for businesses. You write with authority and precision. Never use em dashes. Use hyphens instead. Be specific with dollar amounts and timelines. Output valid JSON only.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      return new Response(
        JSON.stringify({ report: "" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const reportContent = data.choices?.[0]?.message?.content || "";

    return new Response(
      JSON.stringify({ report: reportContent }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating report:", error);
    return new Response(
      JSON.stringify({ report: "" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
}

function buildPrompt(result: AssessmentResult): string {
  const { overallScore, categories, answers, userInfo, industry, revenue, employees } = result;

  // Map answer IDs to readable descriptions
  const answerDescriptions: string[] = [];
  const answerMap: Record<number, string> = {
    4: "Lead handling",
    5: "Lead response time",
    6: "Daily manual processes",
    7: "Current tools",
    8: "AI experience",
    9: "Biggest bottleneck",
    10: "Customer acquisition cost",
    11: "Monthly churn rate",
    12: "Close rate on leads",
    13: "Time on automatable tasks",
    14: "Value of 20% efficiency gain",
    15: "Desired timeline for AI results",
  };

  for (const [id, label] of Object.entries(answerMap)) {
    const answer = answers[Number(id)];
    if (answer) {
      const val = Array.isArray(answer) ? answer.join(", ") : answer;
      answerDescriptions.push(`${label}: ${val}`);
    }
  }

  const categoryBreakdown = categories
    .map((c) => `${c.name}: ${c.percentage}% (weight: ${Math.round(c.weight * 100)}%)`)
    .join("\n");

  return `Generate a personalized AI Readiness Report for this business. Return valid JSON with these exact keys:

{
  "revenueLeaks": ["string", "string", "string"],
  "roadmap": ["string for days 1-30", "string for days 31-60", "string for days 61-90"],
  "roi": "string with specific dollar amount",
  "quickWins": ["string", "string", "string"],
  "strategicPlays": ["string", "string", "string"]
}

BUSINESS PROFILE:
- Name: ${userInfo.name}
- Company: ${userInfo.company}
- Industry: ${industry}
- Annual Revenue: ${revenue}
- Employees: ${employees}

AI READINESS SCORE: ${overallScore}/100

CATEGORY SCORES:
${categoryBreakdown}

ASSESSMENT ANSWERS:
${answerDescriptions.join("\n")}

INSTRUCTIONS:
1. revenueLeaks: List exactly 3 specific revenue leaks with estimated dollar amounts based on their ${revenue} revenue. Be specific to their ${industry} industry. Each should be 1-2 sentences.
2. roadmap: Provide a 30/60/90 day implementation plan with 3 phases. Each phase should be 2-3 sentences with specific actions for a ${industry} business.
3. roi: One paragraph estimating the annual ROI of AI implementation with a specific dollar range based on their revenue of ${revenue}. Include percentage improvements.
4. quickWins: 3 specific actions they can implement this week. Be tactical and specific to ${industry}.
5. strategicPlays: 3 longer-term strategic initiatives for the next 90 days. Be specific to their bottlenecks and industry.

Never use em dashes. Use hyphens or commas instead. Be authoritative and specific.`;
}
