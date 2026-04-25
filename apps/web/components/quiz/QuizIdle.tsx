import { ArrowLeft, BookOpen, ChevronRight, Clock } from "lucide-react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

interface Quiz {
  title: string;
  description?: string;
  time_limit: number;
}

interface Attempt {
  score: number;
}

interface Props {
  quiz: Quiz;
  attempts: Attempt[] | undefined;
  isStarting: boolean;
  onStart: () => void;
  onBack: () => void;
}

export default function QuizIdle({
  quiz,
  attempts,
  isStarting,
  onStart,
  onBack,
}: Props) {
  const lastAttempt = attempts?.[0];
  const hasAttempted = attempts && attempts.length > 0;

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-4">
      <button
        onClick={onBack}
        className="flex items-center cursor-pointer gap-2 text-sm text-gray-500 hover:text-gray-900 w-fit"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <Card padding="lg" className="flex flex-col gap-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen size={28} className="text-primary" />
          </div>
          <h1 className="text-xl font-medium text-gray-900">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-sm text-gray-500 mt-2">{quiz.description}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 bg-gray-50 rounded-lg p-4">
          {quiz.time_limit > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-1.5">
                <Clock size={14} /> Time limit
              </span>
              <span className="font-medium text-gray-900">
                {Math.floor(quiz.time_limit / 60)} minutes
              </span>
            </div>
          )}
          {lastAttempt && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Last score</span>
              <span className="font-medium text-primary">
                {Math.round(lastAttempt.score)}%
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total attempts</span>
            <span className="font-medium text-gray-900">
              {attempts?.length ?? 0}x
            </span>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full"
          isLoading={isStarting}
          onClick={onStart}
        >
          {hasAttempted ? "Try again" : "Start quiz"}
          <ChevronRight size={16} />
        </Button>
      </Card>
    </div>
  );
}
