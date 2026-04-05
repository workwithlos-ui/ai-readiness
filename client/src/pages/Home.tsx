/*
 * AI Readiness Assessment - Main Page
 * Design: Swiss Precision - Neo-Swiss minimalism, teal accent on true black
 * Typography: Plus Jakarta Sans (headings), Space Grotesk (numbers)
 */
import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { HeroScreen } from "@/components/HeroScreen";
import { QuizScreen } from "@/components/QuizScreen";
import { EmailCapture } from "@/components/EmailCapture";
import { ReportScreen } from "@/components/ReportScreen";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  screens,
  calculateScores,
  type AssessmentAnswers,
  type UserInfo,
  type AssessmentResult,
} from "@/lib/assessment-data";

type AppState = "hero" | "quiz" | "email" | "loading" | "report";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("hero");
  const [currentScreen, setCurrentScreen] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [aiReport, setAiReport] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const totalScreens = screens.length;
  const progress = appState === "quiz" ? ((currentScreen + 1) / totalScreens) * 100 : 0;

  const handleStart = useCallback(() => {
    setAppState("quiz");
    setCurrentScreen(0);
  }, []);

  const handleAnswer = useCallback(
    (questionId: number, value: string | string[]) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    []
  );

  const handleNext = useCallback(() => {
    if (currentScreen < totalScreens - 1) {
      setCurrentScreen((prev) => prev + 1);
    } else {
      setAppState("email");
    }
  }, [currentScreen, totalScreens]);

  const handleBack = useCallback(() => {
    if (currentScreen > 0) {
      setCurrentScreen((prev) => prev - 1);
    } else {
      setAppState("hero");
    }
  }, [currentScreen]);

  const handleEmailSubmit = useCallback(
    async (userInfo: UserInfo) => {
      setAppState("loading");
      setIsGenerating(true);

      const { overallScore, categories } = calculateScores(answers);
      const industry = (answers[1] as string) || "Other";
      const revenue = (answers[2] as string) || "Under $500K";
      const employees = (answers[3] as string) || "1-5";

      const assessmentResult: AssessmentResult = {
        overallScore,
        categories,
        answers,
        userInfo,
        industry,
        revenue,
        employees,
      };

      setResult(assessmentResult);

      // Call the API to generate the report
      try {
        const response = await fetch("/api/generate-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(assessmentResult),
        });

        if (response.ok) {
          const data = await response.json();
          setAiReport(data.report || "");
        } else {
          // Fallback: generate a basic report client-side
          setAiReport("");
        }
      } catch {
        setAiReport("");
      }

      setIsGenerating(false);
      setAppState("report");
    },
    [answers]
  );

  const canProceed = useCallback(() => {
    const currentQuestions = screens[currentScreen]?.questions || [];
    return currentQuestions.every((q) => {
      const answer = answers[q.id];
      if (q.type === "multi-select") {
        return Array.isArray(answer) && answer.length > 0;
      }
      return answer !== undefined && answer !== "";
    });
  }, [currentScreen, answers]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header progress={progress} showProgress={appState === "quiz"} />

      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {appState === "hero" && (
            <HeroScreen key="hero" onStart={handleStart} />
          )}

          {appState === "quiz" && (
            <QuizScreen
              key={`quiz-${currentScreen}`}
              screen={screens[currentScreen]}
              screenIndex={currentScreen}
              totalScreens={totalScreens}
              answers={answers}
              onAnswer={handleAnswer}
              onNext={handleNext}
              onBack={handleBack}
              canProceed={canProceed()}
            />
          )}

          {appState === "email" && (
            <EmailCapture key="email" onSubmit={handleEmailSubmit} onBack={() => setAppState("quiz")} />
          )}

          {appState === "loading" && (
            <div key="loading" className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-teal-500/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
                </div>
                <p className="text-lg font-medium text-white">Analyzing your responses...</p>
                <p className="text-sm text-gray-500 mt-2">Generating your personalized AI readiness report</p>
              </div>
            </div>
          )}

          {appState === "report" && result && (
            <ReportScreen key="report" result={result} aiReport={aiReport} />
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
