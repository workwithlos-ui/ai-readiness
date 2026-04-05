/*
 * Quiz Screen - Multi-step form with card-style selections
 * Swiss Precision: Clean cards, teal selection state, smooth transitions
 */
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Screen, AssessmentAnswers } from "@/lib/assessment-data";

interface QuizScreenProps {
  screen: Screen;
  screenIndex: number;
  totalScreens: number;
  answers: AssessmentAnswers;
  onAnswer: (questionId: number, value: string | string[]) => void;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
}

export function QuizScreen({
  screen,
  screenIndex,
  totalScreens,
  answers,
  onAnswer,
  onNext,
  onBack,
  canProceed,
}: QuizScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex-1 flex flex-col items-center justify-center py-10 sm:py-16 px-4"
    >
      <div className="w-full max-w-xl">
        {/* Screen header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-teal-500 font-['Space_Grotesk'] tracking-wider uppercase">
              Step {screenIndex + 1} of {totalScreens}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {screen.title}
          </h2>
          <p className="text-sm text-gray-500 mt-1.5">{screen.subtitle}</p>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {screen.questions.map((question, qi) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qi * 0.1, duration: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {question.text}
              </label>

              {question.type === "dropdown" ? (
                <DropdownSelect
                  options={question.options.map((o) => ({
                    label: o.label,
                    value: o.value,
                  }))}
                  value={(answers[question.id] as string) || ""}
                  onChange={(val) => onAnswer(question.id, val)}
                />
              ) : question.type === "multi-select" ? (
                <MultiSelectCards
                  options={question.options}
                  selected={(answers[question.id] as string[]) || []}
                  onChange={(val) => onAnswer(question.id, val)}
                />
              ) : (
                <SingleSelectCards
                  options={question.options}
                  selected={(answers[question.id] as string) || ""}
                  onChange={(val) => onAnswer(question.id, val)}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={onNext}
            disabled={!canProceed}
            className="flex items-center gap-2 px-6 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:bg-gray-800 disabled:text-gray-600 text-[#0a0a0a] disabled:cursor-not-allowed font-semibold text-sm rounded-lg transition-all duration-200"
          >
            {screenIndex === totalScreens - 1 ? "Get Your Score" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* Single Select Cards */
function SingleSelectCards({
  options,
  selected,
  onChange,
}: {
  options: { label: string; value: string }[];
  selected: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="grid gap-2">
      {options.map((option) => {
        const isSelected = selected === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              relative text-left px-4 py-3 rounded-lg border text-sm transition-all duration-150
              ${
                isSelected
                  ? "bg-teal-500/10 border-teal-500/40 text-white"
                  : "bg-white/[0.02] border-white/[0.06] text-gray-400 hover:bg-white/[0.04] hover:border-white/10 hover:text-gray-300"
              }
            `}
          >
            <div className="flex items-center justify-between">
              <span>{option.label}</span>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-[#0a0a0a]" />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* Multi Select Cards */
function MultiSelectCards({
  options,
  selected,
  onChange,
}: {
  options: { label: string; value: string }[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const handleToggle = (value: string) => {
    if (value === "None of the above") {
      onChange(selected.includes(value) ? [] : [value]);
      return;
    }
    const filtered = selected.filter((s) => s !== "None of the above");
    if (filtered.includes(value)) {
      onChange(filtered.filter((s) => s !== value));
    } else {
      onChange([...filtered, value]);
    }
  };

  return (
    <div>
      <p className="text-xs text-gray-600 mb-2">Select all that apply</p>
      <div className="grid gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <button
              key={option.value}
              onClick={() => handleToggle(option.value)}
              className={`
                relative text-left px-4 py-3 rounded-lg border text-sm transition-all duration-150
                ${
                  isSelected
                    ? "bg-teal-500/10 border-teal-500/40 text-white"
                    : "bg-white/[0.02] border-white/[0.06] text-gray-400 hover:bg-white/[0.04] hover:border-white/10 hover:text-gray-300"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span>{option.label}</span>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-[#0a0a0a]" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Custom Dropdown */
function DropdownSelect({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-150 flex items-center justify-between
          ${
            value
              ? "bg-teal-500/10 border-teal-500/40 text-white"
              : "bg-white/[0.02] border-white/[0.06] text-gray-500 hover:bg-white/[0.04] hover:border-white/10"
          }
        `}
      >
        <span>{selectedLabel || "Select an option"}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute z-50 w-full mt-1 py-1 bg-[#141414] border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto"
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`
                w-full text-left px-4 py-2.5 text-sm transition-colors
                ${
                  value === option.value
                    ? "text-teal-400 bg-teal-500/10"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-300"
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
