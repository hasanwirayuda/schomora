import LeaderboardPodiumBlock from "./LeaderboardPodiumBlock";

interface Entry {
  user_id: string;
  name: string;
  xp: number;
  rank: number;
}

interface Props {
  top3: Entry[];
}

const PODIUM_HEIGHTS: Record<number, string> = {
  0: "100px",
  1: "125px",
  2: "80px",
};

export default function LeaderboardPodium({ top3 }: Props) {
  if (top3.length < 3) return null;

  // Reorder: 2nd, 1st, 3rd
  const ordered = [top3[1], top3[0], top3[2]];

  return (
    <div className="flex items-end justify-center gap-6">
      {ordered.map((entry, i) => (
        <LeaderboardPodiumBlock
          key={entry.user_id}
          name={entry.name}
          xp={entry.xp}
          rank={entry.rank}
          height={PODIUM_HEIGHTS[i]}
          highlight={entry.rank === 1}
        />
      ))}
    </div>
  );
}
