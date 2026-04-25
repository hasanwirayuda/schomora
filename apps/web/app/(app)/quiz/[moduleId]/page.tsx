"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { quizApi, SubmitAnswerInput } from "@/lib/api/quiz";
import { QuestionOption } from "@/lib/types";
import { useQuizTimer } from "@/hooks/useQuizTimer";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import QuizIdle from "@/components/quiz/QuizIdle";
import QuizProgress from "@/components/quiz/QuizProgress";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import QuizNavigation from "@/components/quiz/QuizNavigation";

interface ParsedQuestion {
  id: string;
  body: string;
  topic_tag: string;
  difficulty: number;
  type: string;
  options: QuestionOption[];
  explanation: string;
}

export default function QuizPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const router = useRouter();

  const [phase, setPhase] = useState<"idle" | "ongoing" | "submitting">("idle");
  const [attemptID, setAttemptID] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startTimes, setStartTimes] = useState<Record<string, number>>({});
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(0);

  const {
    data: quiz,
    isLoading: quizLoading,
    error: quizError,
  } = useQuery({
    queryKey: ["quiz", moduleId],
    queryFn: () => quizApi.getByModule(moduleId),
  });

  const { data: attempts } = useQuery({
    queryKey: ["attempts", quiz?.id],
    queryFn: () => quizApi.getMyAttempts(quiz!.id),
    enabled: !!quiz?.id,
  });

  const handleSubmit = useCallback(() => {
    if (!attemptID || phase === "submitting") return;
    setPhase("submitting");

    const submittedAnswers: SubmitAnswerInput[] = questions.map((q) => ({
      question_id: q.id,
      answer: answers[q.id] || "",
      time_spent_ms: startTimes[q.id] ? Date.now() - startTimes[q.id] : 0,
    }));

    submitQuiz(submittedAnswers);
  }, [attemptID, answers, questions, startTimes, phase]);

  const { timeLeft, formatted: formattedTime } = useQuizTimer({
    initialSeconds: timeLimitSeconds,
    isActive: phase === "ongoing" && timeLimitSeconds > 0,
    onExpire: handleSubmit,
  });

  useEffect(() => {
    if (phase !== "ongoing" || !questions[currentIndex]) return;
    const qid = questions[currentIndex].id;
    if (!startTimes[qid]) {
      setStartTimes((prev) => ({ ...prev, [qid]: Date.now() }));
    }
  }, [currentIndex, phase]);

  const { mutate: startQuiz, isPending: isStarting } = useMutation({
    mutationFn: () => quizApi.start(quiz!.id),
    onSuccess: (data) => {
      const parsed: ParsedQuestion[] = data.questions.map((q: any) => ({
        ...q,
        options:
          typeof q.options === "string" ? JSON.parse(q.options) : q.options,
      }));
      setAttemptID(data.attempt.id);
      setQuestions(parsed);
      setCurrentIndex(0);
      setAnswers({});
      setStartTimes({});
      setTimeLimitSeconds(
        quiz?.time_limit && quiz.time_limit > 0 ? quiz.time_limit : 0,
      );
      setPhase("ongoing");
    },
  });

  const { mutate: submitQuiz, isPending: isSubmitting } = useMutation({
    mutationFn: (submittedAnswers: SubmitAnswerInput[]) =>
      quizApi.submit(attemptID!, submittedAnswers),
    onSuccess: (data) => {
      router.push(`/quiz/${moduleId}/result?attemptId=${data.id}`);
    },
  });

  if (quizLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (quizError || !quiz) {
    return (
      <div className="max-w-lg mx-auto mt-16">
        <Card className="text-center py-12">
          <AlertCircle size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">Quiz not found for this module</p>
          <Button variant="secondary" onClick={() => router.back()}>
            <ArrowLeft size={16} /> Back
          </Button>
        </Card>
      </div>
    );
  }

  if (phase === "idle") {
    return (
      <QuizIdle
        quiz={quiz}
        attempts={attempts}
        isStarting={isStarting}
        onStart={() => startQuiz()}
        onBack={() => router.back()}
      />
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4">
      <QuizProgress
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        hasTimeLimit={timeLimitSeconds > 0}
        timeLeft={timeLeft}
        formattedTime={formattedTime()}
      />

      <QuizQuestion
        question={currentQuestion}
        selectedAnswer={answers[currentQuestion?.id]}
        onSelectAnswer={(qId, optId) =>
          setAnswers((prev) => ({ ...prev, [qId]: optId }))
        }
      />

      <QuizNavigation
        questions={questions}
        currentIndex={currentIndex}
        answers={answers}
        answeredCount={answeredCount}
        isSubmitting={isSubmitting || phase === "submitting"}
        onPrevious={() => setCurrentIndex((i) => Math.max(0, i - 1))}
        onNext={() =>
          setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))
        }
        onGoTo={setCurrentIndex}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
