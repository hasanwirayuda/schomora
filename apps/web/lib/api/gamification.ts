import api from "@/lib/axios";
import { LeaderboardEntry, UserBadge } from "@/lib/types";

export const gamificationApi = {
  getLeaderboard: async (limit = 10): Promise<LeaderboardEntry[]> => {
    const res = await api.get(`/leaderboard?limit=${limit}`);
    return res.data;
  },

  getMyRank: async (): Promise<{ rank: number; xp: number }> => {
    const res = await api.get("/me/rank");
    return res.data;
  },

  getMyBadges: async (): Promise<UserBadge[]> => {
    const res = await api.get("/me/badges");
    return res.data;
  },
};
