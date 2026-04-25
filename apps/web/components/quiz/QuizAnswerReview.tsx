import { CheckCircle2, XCircle } from "lucide-react";
import Card from "@/components/ui/card";

interface Answer {
  id: string;
  is_correct: boolean;
  question?: {
    body: string;
    explanation?: string;
  };
}

interface Props {
  answers: Answer[];
}

export default function QuizAnswerReview({ answers }: Props) {
  if (answers.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-medium text-gray-900">Review answers</h2>
      {answers.map((answer, index) => (
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
  );
}
