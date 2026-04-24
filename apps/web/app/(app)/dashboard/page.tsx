"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/auth";
import { progressApi } from "@/lib/api/progress";
import { gamificationApi } from "@/lib/api/gamification";
import OverviewSection from "@/components/dashboard/OverviewSection";
import CourseProgressSection from "@/components/dashboard/CourseProgressSection";
import CourseProgressChart from "@/components/dashboard/CourseProgressChart";
import BadgesSection from "@/components/dashboard/BadgesSection";
import Card from "@/components/ui/card";

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: progressApi.getDashboard,
  });

  const { data: rank } = useQuery({
    queryKey: ["my-rank"],
    queryFn: gamificationApi.getMyRank,
  });

  const { data: badges } = useQuery({
    queryKey: ["my-badges"],
    queryFn: gamificationApi.getMyBadges,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-medium text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-500 mt-1">
          Continue your learning journey today.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          <OverviewSection
            totalEnrolled={dashboard?.total_enrolled ?? 0}
            totalCompleted={dashboard?.total_completed ?? 0}
            xp={rank?.xp ?? 0}
            rank={rank?.rank ?? "-"}
          />
          <CourseProgressSection
            courseProgresses={dashboard?.course_progresses}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-gray-900 text-lg font-medium pb-2 -mt-1">
              Courses' Progress Status
            </h3>
            <Card bgColor="bg-slate-100" border={false}>
              <CourseProgressChart
                courseProgresses={dashboard?.course_progresses}
              />
            </Card>
          </div>
          <BadgesSection badges={badges} />
        </div>
      </div>
    </div>
  );
}
