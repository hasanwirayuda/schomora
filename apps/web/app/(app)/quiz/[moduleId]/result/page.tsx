"use client";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import Link from "next/link";
import { quizApi } from "@/lib/api/quiz";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  ArrowLeft,
  Zap,
} from "lucide-react";

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const score = Math.round(attempt.score);
  const isPassing = score >= 70;
  const correctCount = attempt.answers?.filter((a) => a.is_correct).length || 0;
  const totalCount = attempt.answers?.length || 0;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* Score card */}
      <Card padding="lg" className="text-center">
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isPassing ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <span
            className={`text-3xl font-bold ${
              isPassing ? "text-green-600" : "text-red-600"
            }`}
          >
            {score}%
          </span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-1">
          {isPassing ? "Selamat! 🎉" : "Coba lagi ya!"}
        </h1>
        <p className="text-gray-500 text-sm">
          {isPassing
            ? "Kamu berhasil menyelesaikan quiz ini dengan baik"
            : "Kamu belum mencapai passing score 70%. Jangan menyerah!"}
        </p>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-gray-900">{correctCount}</p>
            <p className="text-xs text-gray-500">Benar</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-gray-900">
              {totalCount - correctCount}
            </p>
            <p className="text-xs text-gray-500">Salah</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-amber-600">
              +{isPassing ? (score === 100 ? 50 : 25) : 10} XP
            </p>
            <p className="text-xs text-gray-500">XP didapat</p>
          </div>
        </div>

        {/* Ability estimate */}
        <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-indigo-700 font-medium flex items-center gap-1">
              <Zap size={12} /> Ability estimate
            </p>
            <p className="text-xs font-bold text-indigo-700">
              {Math.round(attempt.ability_estimate * 100)}%
            </p>
          </div>
          <div className="w-full bg-indigo-100 rounded-full h-1.5">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all"
              style={{ width: `${attempt.ability_estimate * 100}%` }}
            />
          </div>
          <p className="text-xs text-indigo-500 mt-1">
            Soal berikutnya akan disesuaikan dengan kemampuanmu
          </p>
        </div>
      </Card>

      {/* Answer review */}
      {attempt.answers && attempt.answers.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Review jawaban
          </h2>
          {attempt.answers.map((answer, index) => (
            <Card key={answer.id} padding="sm">
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  {answer.is_correct ? (
                    <CheckCircle2 size={18} className="text-green-500" />
                  ) : (
                    <XCircle size={18} className="text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    {index + 1}. {answer.question?.body}
                  </p>
                  {answer.question?.explanation && !answer.is_correct && (
                    <p className="text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded p-2">
                      💡 {answer.question.explanation}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => router.push(`/quiz/${moduleId}`)}
        >
          <RotateCcw size={14} /> Coba lagi
        </Button>
        <Link href="/dashboard" className="flex-1">
          <Button className="w-full">
            <Trophy size={14} /> Ke dashboard
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
