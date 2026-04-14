import api from "@/lib/axios";
import { CourseProgressSummary, SkillMapItem } from "@/lib/types";

export interface DashboardData {
  total_enrolled: number;
  total_completed: number;
  current_streak: number;
  xp_total: number;
  course_progresses: CourseProgressSummary[];
  skill_map: SkillMapItem[];
}

export const progressApi = {
  getDashboard: async (): Promise<DashboardData> => {
    const res = await api.get("/dashboard");
    return res.data;
  },
};
