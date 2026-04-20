"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { quizApi, SubmitAnswerInput } from "@/lib/api/quiz";
import { courseApi } from "@/lib/api/course";
import { QuestionOption } from "@/lib/types";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import {
  Clock,
  ArrowLeft,
  ChevronRight,
  BookOpen,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

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
  const [timeLeft, setTimeLeft] = useState(0);

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

  useEffect(() => {
    if (phase !== "ongoing" || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, timeLeft]);

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
      if (quiz?.time_limit && quiz.time_limit > 0) {
        setTimeLeft(quiz.time_limit);
      }
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

  const handleSelectAnswer = (questionID: string, optionID: string) => {
    setAnswers((prev) => ({ ...prev, [questionID]: optionID }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

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
    const lastAttempt = attempts?.[0];

    return (
      <div className="max-w-lg mx-auto flex flex-col gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 w-fit"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <Card padding="lg" className="flex flex-col gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen size={28} className="text-primary" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
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
                {attempts?.length || 0}x
              </span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            isLoading={isStarting}
            onClick={() => startQuiz()}
          >
            {attempts && attempts.length > 0 ? "Try again" : "Start quiz"}
            <ChevronRight size={16} />
          </Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;
  const currentAnswer = answers[currentQuestion?.id];

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {questions.length}
          </span>
          <div className="w-32 bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        {quiz.time_limit > 0 && (
          <div
            className={`flex items-center gap-1.5 text-sm font-mono font-medium ${
              timeLeft < 60 ? "text-red-600" : "text-gray-700"
            }`}
          >
            <Clock size={14} />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs bg-indigo-50 text-primary px-2 py-0.5 rounded-full">
            {currentQuestion.topic_tag}
          </span>
          <span className="text-xs text-gray-400">
            Difficulty: {Math.round(currentQuestion.difficulty * 10)}/10
          </span>
        </div>

        <p className="text-base font-medium text-gray-900 mb-6 leading-relaxed">
          {currentQuestion.body}
        </p>

        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((option) => {
            const isSelected = currentAnswer === option.id;
            return (
              <button
                key={option.id}
                onClick={() =>
                  handleSelectAnswer(currentQuestion.id, option.id)
                }
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-150 ${
                  isSelected
                    ? "border-primary bg-indigo-50 text-primary font-medium"
                    : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                <span className="font-medium mr-2 uppercase">{option.id}.</span>
                {option.text}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
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
            onClick={handleSubmit}
            isLoading={isSubmitting || phase === "submitting"}
            disabled={answeredCount === 0}
          >
            <CheckCircle2 size={14} /> Submit quiz
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() =>
              setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))
            }
          >
            Next <ChevronRight size={14} />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrentIndex(i)}
            className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
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
