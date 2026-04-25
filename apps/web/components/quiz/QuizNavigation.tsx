import { ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
import Button from "@/components/ui/button";

interface ParsedQuestion {
  id: string;
}

interface Props {
  questions: ParsedQuestion[];
  currentIndex: number;
  answers: Record<string, string>;
  answeredCount: number;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
  onSubmit: () => void;
}

export default function QuizNavigation({
  questions,
  currentIndex,
  answers,
  answeredCount,
  isSubmitting,
  onPrevious,
  onNext,
  onGoTo,
  onSubmit,
}: Props) {
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          size="sm"
          onClick={onPrevious}
          disabled={currentIndex === 0}
        >
          <ArrowLeft size={14} /> Previous
        </Button>

        <span className="text-xs text-gray-400">
          {answeredCount}/{questions.length} answered
        </span>

        {isLastQuestion ? (
          <Button
            size="sm"
            onClick={onSubmit}
            isLoading={isSubmitting}
            disabled={answeredCount === 0}
          >
            <CheckCircle2 size={14} /> Submit quiz
          </Button>
        ) : (
          <Button size="sm" onClick={onNext}>
            Next <ChevronRight size={14} />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => onGoTo(i)}
            className={`w-8 h-8 rounded-full text-xs font-medium transition-all cursor-pointer ${
              i === currentIndex
                ? "bg-primary text-white"
                : answers[q.id]
                  ? "bg-indigo-50 text-primary"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
