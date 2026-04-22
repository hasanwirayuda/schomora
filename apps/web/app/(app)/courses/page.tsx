"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseApi } from "@/lib/api/course";
import { useAuthStore } from "@/lib/store/auth";
import { Course } from "@/lib/types";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Users, ChevronRight } from "lucide-react";

export default function CoursesPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: courseApi.getAll,
  });

  const { data: enrollments } = useQuery({
    queryKey: ["enrollments"],
    queryFn: courseApi.getMyEnrollments,
  });

  const enrolledCourseIDs = new Set(enrollments?.map((e) => e.course_id) || []);

  const { mutate: enroll, isPending: isEnrolling } = useMutation({
    mutationFn: courseApi.enroll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-medium text-gray-900">Browse Courses</h1>
        <p className="text-gray-500 mt-1">
          Find courses that match your interests
        </p>
      </div>

      {!courses || courses.length === 0 ? (
        <Card className="text-center py-16">
          <BookOpen size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No courses available yet</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course: Course) => {
            const isEnrolled = enrolledCourseIDs.has(course.id);
            const isOwner = course.author_id === user?.id;

            return (
              <Card
                key={course.id}
                padding="sm"
                className="flex flex-col gap-3"
              >
                <div className="w-full h-36 rounded-lg overflow-hidden bg-linear-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen size={32} className="text-indigo-400" />
                  )}
                </div>

                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-gray-900 text-sm leading-tight">
                      {course.title}
                    </h3>
                    {isOwner && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                        Yours
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {course.description || "No description"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    by {course.author?.name || "Unknown"}
                  </p>
                </div>

                <div className="flex gap-2 pt-1 border-t border-gray-100">
                  {isOwner ? (
                    <Link href={`/courses/${course.id}`} className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full">
                        Manage course <ChevronRight size={14} />
                      </Button>
                    </Link>
                  ) : isEnrolled ? (
                    <Link href={`/courses/${course.id}`} className="flex-1">
                      <Button size="sm" className="w-full">
                        Continue learning <ChevronRight size={14} />
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1"
                      isLoading={isEnrolling}
                      onClick={() => enroll(course.id)}
                    >
                      Enroll for free
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
