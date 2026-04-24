"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { courseApi } from "@/lib/api/course";
import { useAuthStore } from "@/lib/store/auth";
import CourseHeader from "@/components/course/CourseHeader";
import CourseProgress from "@/components/course/CourseProgress";
import ModuleList from "@/components/course/ModuleList";
import SkillMap from "@/components/course/SkillMap";

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

  const isEnrolled = enrollments?.some((e) => e.course_id === id) ?? false;
  const isOwner = course?.author_id === user?.id;
  const modules = course?.modules ?? [];

  const completedModuleIDs = new Set(
    progress?.completed_modules > 0
      ? modules.slice(0, progress.completed_modules).map((m: any) => m.id)
      : [],
  );

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

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => router.back()}
        className="flex items-center cursor-pointer gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors w-fit"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <CourseHeader
        title={course.title}
        description={course.description}
        authorName={course.author?.name ?? "Unknown"}
        isOwner={isOwner}
        isEnrolled={isEnrolled}
        isEnrolling={isEnrolling}
        onEnroll={enroll}
      />

      {isEnrolled && progress && (
        <CourseProgress
          courseId={id}
          completedModules={progress.completed_modules}
          totalModules={progress.total_modules}
          progressPercent={progress.progress_percent}
          isCompleted={progress.is_completed}
        />
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ModuleList
            modules={modules}
            completedModuleIDs={completedModuleIDs}
            isEnrolled={isEnrolled}
            isOwner={isOwner}
            onMarkComplete={markComplete}
          />
        </div>

        {isEnrolled && skillMap && skillMap.length > 0 && (
          <SkillMap skillMap={skillMap} />
        )}
      </div>
    </div>
  );
}
