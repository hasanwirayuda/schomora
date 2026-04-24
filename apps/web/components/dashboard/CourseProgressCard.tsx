import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

interface CourseProgress {
  course_id: string;
  course_title: string;
  completed_modules: number;
  total_modules: number;
  progress_percent: number;
  is_completed: boolean;
}

interface Props {
  courseProgress: CourseProgress;
}

export default function CourseProgressCard({ courseProgress: cp }: Props) {
  return (
    <Card padding="sm" bgColor="bg-slate-100" border={false}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-medium text-gray-900 text-sm">{cp.course_title}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {cp.completed_modules}/{cp.total_modules} modules completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          {cp.is_completed && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              Completed
            </span>
          )}
          <Link href={`/courses/${cp.course_id}`}>
            <Button variant="secondary" size="sm">
              <ChevronRight size={14} />
            </Button>
          </Link>
        </div>
      </div>
      <div className="w-full bg-white border border-gray-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-500"
          style={{ width: `${cp.progress_percent}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1.5 text-right">
        {Math.round(cp.progress_percent)}%
      </p>
    </Card>
  );
}
