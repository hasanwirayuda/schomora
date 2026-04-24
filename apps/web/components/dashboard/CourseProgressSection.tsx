import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import CourseProgressCard from "./CourseProgressCard";

interface CourseProgress {
  course_id: string;
  course_title: string;
  completed_modules: number;
  total_modules: number;
  progress_percent: number;
  is_completed: boolean;
}

interface Props {
  courseProgresses: CourseProgress[] | undefined;
}

export default function CourseProgressSection({ courseProgresses }: Props) {
  const isEmpty = !courseProgresses || courseProgresses.length === 0;

  return (
    <div className="flex flex-col gap-4 bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Course Progress</h2>
        <Link href="/courses">
          <Button variant="secondary" size="sm">
            View all <ChevronRight size={14} />
          </Button>
        </Link>
      </div>

      {isEmpty ? (
        <Card className="text-center py-12">
          <BookOpen size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 mb-4">
            You haven't enrolled in any courses yet
          </p>
          <Link href="/courses">
            <Button>Browse courses</Button>
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {courseProgresses.map((cp) => (
            <CourseProgressCard key={cp.course_id} courseProgress={cp} />
          ))}
        </div>
      )}
    </div>
  );
}
