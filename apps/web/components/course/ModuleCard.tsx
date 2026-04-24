import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Circle, ChevronRight } from "lucide-react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { quizApi } from "@/lib/api/quiz";

interface Module {
  id: string;
  title: string;
  description: string;
}

interface Props {
  module: Module;
  index: number;
  isCompleted: boolean;
  isEnrolled: boolean;
  isOwner: boolean;
  onMarkComplete: (moduleId: string) => void;
}

export default function ModuleCard({
  module,
  index,
  isCompleted,
  isEnrolled,
  isOwner,
  onMarkComplete,
}: Props) {
  const { data: quiz } = useQuery({
    queryKey: ["quiz", module.id],
    queryFn: () => quizApi.getByModule(module.id),
    enabled: isEnrolled,
  });

  const { data: attempts } = useQuery({
    queryKey: ["quiz-attempts", quiz?.id],
    queryFn: () => quizApi.getMyAttempts(quiz!.id),
    enabled: !!quiz?.id && isEnrolled,
  });

  const passingScore = 70;
  const hasPassed = attempts?.some(
    (a) => a.score >= passingScore && a.completed_at,
  );
  const canMarkComplete = isEnrolled && !isCompleted && hasPassed;

  return (
    <Card padding="sm" className="flex items-center gap-4">
      <div className="shrink-0">
        {isCompleted ? (
          <CheckCircle size={20} className="text-green-500" />
        ) : (
          <Circle size={20} className="text-gray-300" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">
          {index + 1}. {module.title}
        </p>
        <p className="text-xs text-gray-500 truncate">{module.description}</p>
      </div>

      {(isEnrolled || isOwner) && (
        <div className="flex items-center gap-2 shrink-0">
          {canMarkComplete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkComplete(module.id)}
            >
              Mark complete
            </Button>
          )}
          <Link href={`/quiz/${module.id}`}>
            <Button size="sm" variant={isCompleted ? "secondary" : "primary"}>
              Quiz <ChevronRight size={14} />
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
