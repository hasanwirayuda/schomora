import { useAuthStore } from "@/lib/store/auth";

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

interface Props {
  rank: number;
  xp: number;
}

export default function LeaderboardMyRank({ rank, xp }: Props) {
  const { user } = useAuthStore();

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-teal-200 bg-teal-50">
      <div className="w-9 h-9 rounded-full bg-white border border-teal-200 flex items-center justify-center text-sm font-medium text-primary">
        {getInitials(user?.name ?? "?")}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-black">Your rank</p>
        <p className="text-xs text-primary">{user?.name}</p>
      </div>
      <div className="text-right">
        <p className="text-xl font-medium text-black">{rank}</p>
        <p className="text-xs text-primary">{xp} XP</p>
      </div>
    </div>
  );
}
