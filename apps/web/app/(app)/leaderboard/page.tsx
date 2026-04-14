"use client";

import { useQuery } from "@tanstack/react-query";
import { gamificationApi } from "@/lib/api/gamification";
import { useAuthStore } from "@/lib/store/auth";
import Card from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";

export default function LeaderboardPage() {
  const { user } = useAuthStore();

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => gamificationApi.getLeaderboard(20),
  });

  const { data: myRank } = useQuery({
    queryKey: ["my-rank"],
    queryFn: gamificationApi.getMyRank,
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
        <p className="text-gray-500 mt-1">Top learner minggu ini</p>
      </div>

      {/* My rank */}
      {myRank && (
        <Card padding="sm" className="border-indigo-200 bg-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy size={20} className="text-indigo-600" />
              <div>
                <p className="text-sm font-semibold text-indigo-900">
                  Posisi kamu
                </p>
                <p className="text-xs text-indigo-600">{user?.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-indigo-700">
                #{myRank.rank}
              </p>
              <p className="text-xs text-indigo-500">{myRank.xp} XP</p>
            </div>
          </div>
        </Card>
      )}

      {/* Leaderboard list */}
      <Card padding="sm">
        {!leaderboard || leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <Medal size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Belum ada data leaderboard</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-gray-100">
            {leaderboard.map((entry) => {
              const isMe = entry.user_id === user?.id;
              return (
                <div
                  key={entry.user_id}
                  className={`flex items-center gap-4 py-3 px-2 rounded-lg ${
                    isMe ? "bg-indigo-50" : ""
                  }`}
                >
                  <div className="w-10 text-center font-bold text-lg">
                    {getRankIcon(entry.rank)}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        isMe ? "text-indigo-700" : "text-gray-900"
                      }`}
                    >
                      {entry.name} {isMe && "(Kamu)"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-600">
                      {entry.xp} XP
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
