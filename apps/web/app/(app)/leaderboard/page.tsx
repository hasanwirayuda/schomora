"use client";

import { useQuery } from "@tanstack/react-query";
import { gamificationApi } from "@/lib/api/gamification";
import { useAuthStore } from "@/lib/store/auth";
import Card from "@/components/ui/card";
import { Medal } from "lucide-react";
import LeaderboardMyRank from "@/components/leaderboard/LeaderboardMyRank";
import LeaderboardPodium from "@/components/leaderboard/LeaderboardPodium";
import LeaderboardList from "@/components/leaderboard/LeaderboardList";

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const top3 = leaderboard?.slice(0, 3) ?? [];
  const rest = leaderboard?.slice(3) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-medium text-gray-900">Leaderboard</h1>
        <p className="text-gray-500 mt-1">Top learners on Schomora</p>
      </div>

      {myRank && <LeaderboardMyRank rank={myRank.rank} xp={myRank.xp} />}

      {!leaderboard || leaderboard.length === 0 ? (
        <Card className="text-center py-16">
          <Medal size={36} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No leaderboard data yet</p>
        </Card>
      ) : (
        <>
          <LeaderboardPodium top3={top3} />
          {rest.length > 0 && <LeaderboardList entries={rest} />}
        </>
      )}
    </div>
  );
}
