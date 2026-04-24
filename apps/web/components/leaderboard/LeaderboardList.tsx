import { Zap } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";

interface Entry {
  user_id: string;
  name: string;
  xp: number;
  rank: number;
}

interface Props {
  entries: Entry[];
}

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

export default function LeaderboardList({ entries }: Props) {
  const { user } = useAuthStore();

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="grid grid-cols-[40px_1fr_80px] gap-3 px-4 py-2 border-b border-gray-100">
        <span className="text-xs text-gray-400">Rank</span>
        <span className="text-xs text-gray-400">Name</span>
        <span className="text-xs text-gray-400 text-right">XP</span>
      </div>

      {entries.map((entry, i) => {
        const isMe = entry.user_id === user?.id;
        return (
          <div key={entry.user_id}>
            {i > 0 && <div className="h-px bg-gray-100 mx-4" />}
            <div
              className={`grid grid-cols-[40px_1fr_80px] gap-3 items-center px-4 py-2.5 transition-colors ${
                isMe ? "bg-indigo-50" : "hover:bg-slate-50"
              }`}
            >
              <span className="text-sm font-medium text-gray-400">
                {entry.rank}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-100 border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 shrink-0">
                  {getInitials(entry.name)}
                </div>
                <span
                  className={`text-sm ${isMe ? "text-primary font-medium" : "text-gray-900"}`}
                >
                  {entry.name} {isMe && "(You)"}
                </span>
              </div>
              <div className="flex items-center justify-end gap-1">
                <Zap size={12} className="text-amber-500" />
                <span className="text-sm font-medium text-amber-600">
                  {entry.xp}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
