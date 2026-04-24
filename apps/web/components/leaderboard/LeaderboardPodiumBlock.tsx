interface Props {
  name: string;
  xp: number;
  rank: number;
  height: string;
  highlight?: boolean;
}

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

export default function LeaderboardPodiumBlock({
  name,
  xp,
  rank,
  height,
  highlight = false,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-2 flex-1 max-w-[200px]">
      <div
        className={`flex items-center justify-center rounded-xl font-medium text-gray-700 bg-slate-100 border border-gray-200 ${
          highlight
            ? "w-14 h-14 text-lg border-2 border-amber-400"
            : "w-12 h-12 text-base"
        }`}
      >
        {getInitials(name)}
      </div>
      <p className="text-sm font-medium text-gray-900 text-center leading-tight">
        {name}
      </p>
      <div
        className="w-full border border-gray-200 bg-linear-to-b from-primary to-secondary flex flex-col items-center justify-start gap-2 pt-3 pb-2"
        style={{ height }}
      >
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
            rank === 1
              ? "bg-amber-100 text-amber-700"
              : "bg-slate-200 text-gray-500"
          }`}
        >
          {rank}
        </div>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
          {xp} XP
        </span>
      </div>
    </div>
  );
}
