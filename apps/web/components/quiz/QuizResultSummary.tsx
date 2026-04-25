import { Zap } from "lucide-react";
import Card from "@/components/ui/card";

const PASSING_SCORE = 70;

interface StatCardProps {
  value: string | number;
  label: string;
  valueClassName?: string;
}

function StatCard({
  value,
  label,
  valueClassName = "text-gray-900",
}: StatCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className={`text-2xl font-medium ${valueClassName}`}>{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

interface Props {
  score: number;
  correctCount: number;
  totalCount: number;
  abilityEstimate: number;
}

export default function QuizResultSummary({
  score,
  correctCount,
  totalCount,
  abilityEstimate,
}: Props) {
  const isPassing = score >= PASSING_SCORE;
  const xpEarned = isPassing ? (score === 100 ? 50 : 25) : 10;
  const abilityPercent = Math.round(abilityEstimate * 100);

  return (
    <Card padding="lg" className="text-center">
      <div
        className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${isPassing ? "bg-green-100" : "bg-red-100"}`}
      >
        <span
          className={`text-3xl font-medium ${isPassing ? "text-green-600" : "text-red-600"}`}
        >
          {score}%
        </span>
      </div>

      <h1 className="text-xl font-medium text-gray-900 mb-1">
        {isPassing ? "Congratulations! 🎉" : "Try again!"}
      </h1>
      <p className="text-gray-500 text-sm">
        {isPassing
          ? "You have successfully completed this quiz"
          : "You haven't reached the 70% passing score. Don't give up!"}
      </p>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <StatCard value={correctCount} label="Correct" />
        <StatCard value={totalCount - correctCount} label="Incorrect" />
        <StatCard
          value={`+${xpEarned} XP`}
          label="XP earned"
          valueClassName="text-amber-600"
        />
      </div>

      <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-indigo-700 font-medium flex items-center gap-1">
            <Zap size={12} /> Ability estimate
          </p>
          <p className="text-xs font-bold text-indigo-700">{abilityPercent}%</p>
        </div>
        <div className="w-full bg-indigo-100 rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all"
            style={{ width: `${abilityPercent}%` }}
          />
        </div>
        <p className="text-xs text-indigo-500 mt-1">
          The next questions will be adjusted to your ability
        </p>
      </div>
    </Card>
  );
}
