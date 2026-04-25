"use client";

import { Suspense } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { RotateCcw, Trophy } from "lucide-react";
import { quizApi } from "@/lib/api/quiz";
import Button from "@/components/ui/button";
import QuizResultSummary from "@/components/quiz/QuizResultSummary";
import QuizAnswerReview from "@/components/quiz/QuizAnswerReview";

function ResultContent() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const attemptID = searchParams.get("attemptId");

  const { data: attempt, isLoading } = useQuery({
    queryKey: ["attempt", attemptID],
    queryFn: () => quizApi.getAttemptResult(attemptID!),
    enabled: !!attemptID,
  });

  if (isLoading || !attempt) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const score = Math.round(attempt.score);
  const answers = attempt.answers ?? [];
  const correctCount = answers.filter((a) => a.is_correct).length;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <QuizResultSummary
        score={score}
        correctCount={correctCount}
        totalCount={answers.length}
        abilityEstimate={attempt.ability_estimate}
      />

      <QuizAnswerReview answers={answers} />

      <div className="flex gap-3">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => router.push(`/quiz/${moduleId}`)}
        >
          <RotateCcw size={14} /> Try again
        </Button>
        <Link href="/dashboard" className="flex-1">
          <Button className="w-full">
            <Trophy size={14} /> Go to dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
