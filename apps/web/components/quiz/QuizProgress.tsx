import { Clock } from "lucide-react";

interface Props {
  currentIndex: number;
  totalQuestions: number;
  answeredCount: number;
  hasTimeLimit: boolean;
  timeLeft: number;
  formattedTime: string;
}

export default function QuizProgress({
  currentIndex,
  totalQuestions,
  answeredCount,
  hasTimeLimit,
  timeLeft,
  formattedTime,
}: Props) {
  const progressPercent = (answeredCount / totalQuestions) * 100;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">
          {currentIndex + 1} / {totalQuestions}
        </span>
        <div className="w-32 bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      {hasTimeLimit && (
        <div
          className={`flex items-center gap-1.5 text-sm font-mono font-medium ${timeLeft < 60 ? "text-red-600" : "text-gray-700"}`}
        >
          <Clock size={14} />
          {formattedTime}
        </div>
      )}
    </div>
  );
}
