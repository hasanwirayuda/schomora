import { BookOpen, TrendingUp, Zap, Trophy } from "lucide-react";
import OverviewCard from "./OverviewCard";

interface Props {
  totalEnrolled: number;
  totalCompleted: number;
  xp: number;
  rank: number | string;
}

export default function OverviewSection({
  totalEnrolled,
  totalCompleted,
  xp,
  rank,
}: Props) {
  const items = [
    { icon: BookOpen, label: "Courses enrolled", value: totalEnrolled },
    { icon: TrendingUp, label: "Courses completed", value: totalCompleted },
    { icon: Zap, label: "Total XP", value: xp },
    { icon: Trophy, label: "Ranking", value: `#${rank}` },
  ];

  return (
    <div className="h-fit p-4 bg-white border border-gray-200 rounded-xl">
      <h2 className="text-gray-900 text-lg font-medium pb-2 -mt-1">Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <OverviewCard key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}
