import Card from "@/components/ui/card";
import { QuestionOption } from "@/lib/types";

interface ParsedQuestion {
  id: string;
  body: string;
  topic_tag: string;
  difficulty: number;
  options: QuestionOption[];
}

interface Props {
  question: ParsedQuestion;
  selectedAnswer: string | undefined;
  onSelectAnswer: (questionId: string, optionId: string) => void;
}

export default function QuizQuestion({
  question,
  selectedAnswer,
  onSelectAnswer,
}: Props) {
  return (
    <Card padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs bg-indigo-50 text-primary px-2 py-0.5 rounded-full">
          {question.topic_tag}
        </span>
        <span className="text-xs text-gray-400">
          Difficulty: {Math.round(question.difficulty * 10)}/10
        </span>
      </div>

      <p className="text-base font-medium text-gray-900 mb-6 leading-relaxed">
        {question.body}
      </p>

      <div className="flex flex-col gap-3">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelectAnswer(question.id, option.id)}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-150 ${
                isSelected
                  ? "border-primary bg-teal-50 text-primary font-medium"
                  : "border-gray-200 bg-white text-gray-700 hover:border-teal-300 hover:bg-teal-50"
              }`}
            >
              <span className="font-medium mr-2 uppercase">{option.id}.</span>
              {option.text}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
