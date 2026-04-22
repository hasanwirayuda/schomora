"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { progressApi } from "@/lib/api/progress";
import { gamificationApi } from "@/lib/api/gamification";
import { useAuthStore } from "@/lib/store/auth";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import {
  BookOpen,
  Trophy,
  Zap,
  Award,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

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
          <div className="h-fit p-4 bg-white border border-gray-200 rounded-xl">
            <h2 className="text-gray-900 text-lg font-medium pb-2 -mt-1">
              Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card
                padding="sm"
                className="flex flex-col gap-1"
                bgColor="bg-slate-100"
                border={false}
              >
                <div className="flex items-center gap-2 text-primary">
                  <BookOpen size={16} />
                  <span className="text-xs font-medium text-gray-500">
                    Courses enrolled
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboard?.total_enrolled || 0}
                </p>
              </Card>

              <Card
                padding="sm"
                className="flex flex-col gap-1"
                bgColor="bg-slate-100"
                border={false}
              >
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingUp size={16} />
                  <span className="text-xs font-medium text-gray-500">
                    Courses completed
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboard?.total_completed || 0}
                </p>
              </Card>

              <Card
                padding="sm"
                className="flex flex-col gap-1"
                bgColor="bg-slate-100"
                border={false}
              >
                <div className="flex items-center gap-2 text-amber-600">
                  <Zap size={16} />
                  <span className="text-xs font-medium text-gray-500">
                    Total XP
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {rank?.xp || 0}
                </p>
              </Card>

              <Card
                padding="sm"
                className="flex flex-col gap-1"
                bgColor="bg-slate-100"
                border={false}
              >
                <div className="flex items-center gap-2 text-purple-600">
                  <Trophy size={16} />
                  <span className="text-xs font-medium text-gray-500">
                    Ranking
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  #{rank?.rank || "-"}
                </p>
              </Card>
            </div>
          </div>

          <div className="flex flex-col gap-4 bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Course Progress
              </h2>
              <Link href="/courses">
                <Button variant="secondary" size="sm">
                  View all <ChevronRight size={14} />
                </Button>
              </Link>
            </div>

            {!dashboard?.course_progresses ||
            dashboard.course_progresses.length === 0 ? (
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
                {dashboard.course_progresses.map((cp) => (
                  <Card
                    key={cp.course_id}
                    padding="sm"
                    bgColor="bg-slate-100"
                    border={false}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {cp.course_title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {cp.completed_modules}/{cp.total_modules} modules
                          completed
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
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-gray-900 text-lg font-medium pb-2 -mt-1">
              Progress Status
            </h3>
            <Card bgColor="bg-slate-100" border={false} className="h-[250px]">
              <div></div>
            </Card>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h2 className="text-lg font-medium text-gray-900 pb-2 -mt-1">
              Badges
            </h2>
            <Card bgColor="bg-slate-100" border={false}>
              {!badges || badges.length === 0 ? (
                <div className="text-center py-8">
                  <Award size={32} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">
                    Complete quizzes to earn badges!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {badges.map((ub) => (
                    <div key={ub.id} className="flex items-center gap-3">
                      <span className="text-2xl">{ub.badge.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {ub.badge.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {ub.badge.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
