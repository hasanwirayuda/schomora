"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { courseApi } from "@/lib/api/course";
import { useAuthStore } from "@/lib/store/auth";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import {
  BookOpen,
  CheckCircle,
  Circle,
  ChevronRight,
  ArrowLeft,
  Clock,
} from "lucide-react";

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: () => courseApi.getByID(id),
  });

  const { data: progress } = useQuery({
    queryKey: ["course-progress", id],
    queryFn: () => courseApi.getProgress(id),
  });

  const { data: enrollments } = useQuery({
    queryKey: ["enrollments"],
    queryFn: courseApi.getMyEnrollments,
  });

  const { data: skillMap } = useQuery({
    queryKey: ["skill-map", id],
    queryFn: () => courseApi.getSkillMap(id),
    enabled: !!enrollments?.find((e) => e.course_id === id),
  });

  const isEnrolled = enrollments?.some((e) => e.course_id === id);
  const isOwner = course?.author_id === user?.id;

  const { mutate: markComplete } = useMutation({
    mutationFn: courseApi.markModuleComplete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-progress", id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const { mutate: enroll, isPending: isEnrolling } = useMutation({
    mutationFn: () => courseApi.enroll(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!course) return null;

  const modules = course.modules || [];
  const completedModuleIDs = new Set(
    progress?.completed_modules > 0
      ? modules.slice(0, progress.completed_modules).map((m: any) => m.id)
      : [],
  );

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => router.back()}
        className="flex items-center cursor-pointer gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors w-fit"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium text-gray-900">{course.title}</h1>
          <p className="text-gray-500">{course.description}</p>
          <p className="text-sm text-gray-400">
            by {course.author?.name || "Unknown"}
          </p>
        </div>

        {!isOwner && !isEnrolled && (
          <Button isLoading={isEnrolling} onClick={() => enroll()}>
            Enroll for free
          </Button>
        )}
      </div>

      {isEnrolled && progress && (
        <Card padding="sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">Course progress</p>
            <p className="text-sm font-bold text-primary">
              {Math.round(progress.progress_percent)}%
            </p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress.progress_percent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {progress.completed_modules}/{progress.total_modules} modules
            completed
          </p>
          {progress.is_completed && (
            <Link href={`/courses/${id}/certificate`}>
              <Button size="sm" className="mt-3">
                Get certificate 🎓
              </Button>
            </Link>
          )}
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-3">
          <h2 className="text-lg font-medium text-gray-900">
            Modules ({modules.length})
          </h2>

          {modules.length === 0 ? (
            <Card className="text-center py-10">
              <p className="text-gray-400 text-sm">No modules yet</p>
            </Card>
          ) : (
            modules.map((module: any, index: number) => {
              const isCompleted = completedModuleIDs.has(module.id);
              return (
                <Card
                  key={module.id}
                  padding="sm"
                  className="flex items-center gap-4"
                >
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
                    <p className="text-xs text-gray-500 truncate">
                      {module.description}
                    </p>
                  </div>
                  {(isEnrolled || isOwner) && (
                    <div className="flex items-center gap-2 shrink-0">
                      {isEnrolled && !isCompleted && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markComplete(module.id)}
                        >
                          Mark complete
                        </Button>
                      )}
                      <Link href={`/quiz/${module.id}`}>
                        <Button
                          size="sm"
                          variant={isCompleted ? "secondary" : "primary"}
                        >
                          Quiz <ChevronRight size={14} />
                        </Button>
                      </Link>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>

        {isEnrolled && skillMap && skillMap.length > 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Skill Map</h2>
            <Card>
              <div className="flex flex-col gap-3">
                {skillMap.map((item: any) => (
                  <div key={item.topic_tag}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-gray-700">
                        {item.topic_tag}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          item.level === "strong"
                            ? "bg-green-100 text-green-700"
                            : item.level === "moderate"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.level === "strong"
                          ? "Strong"
                          : item.level === "moderate"
                            ? "Moderate"
                            : "Weak"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          item.level === "strong"
                            ? "bg-green-500"
                            : item.level === "moderate"
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${item.accuracy_percent}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 text-right">
                      {Math.round(item.accuracy_percent)}%
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
