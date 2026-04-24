import Link from "next/link";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

interface Props {
  courseId: string;
  completedModules: number;
  totalModules: number;
  progressPercent: number;
  isCompleted: boolean;
}

export default function CourseProgress({
  courseId,
  completedModules,
  totalModules,
  progressPercent,
  isCompleted,
}: Props) {
  return (
    <Card padding="sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-700">Course progress</p>
        <p className="text-sm font-bold text-primary">
          {Math.round(progressPercent)}%
        </p>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {completedModules}/{totalModules} modules completed
      </p>
      {isCompleted && (
        <Link href={`/courses/${courseId}/certificate`}>
          <Button size="sm" className="mt-3">
            Get certificate 🎓
          </Button>
        </Link>
      )}
    </Card>
  );
}
