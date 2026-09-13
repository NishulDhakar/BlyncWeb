import { cn } from "@/lib/utils";

export interface CandidateKpisProps {
  rank: number | null;
  totalScore: number;
  gamesPlayed: number;
  streakDays: number;
  averageAccuracy: number;
  className?: string;
}

export function CandidateKpis({
  rank,
  totalScore,
  gamesPlayed,
  streakDays,
  averageAccuracy,
  className,
}: CandidateKpisProps) {
  const items = [
    {
      label: "Candidate Rank",
      value: rank ? `#${rank}` : "Unranked",
      detail: rank ? "Global ranking" : "Play to qualify",
    },
    {
      label: "Total Points",
      value: totalScore > 0 ? totalScore.toLocaleString() : "0",
      detail: "Cumulative score",
    },
    {
      label: "Rounds Played",
      value: gamesPlayed.toLocaleString(),
      detail: gamesPlayed === 1 ? "1 session completed" : "Assessment rounds",
    },
    {
      label: "Practice Streak",
      value: `${streakDays} ${streakDays === 1 ? "Day" : "Days"}`,
      detail: streakDays > 0 ? "Consecutive activity" : "Start today",
    },
    {
      label: "Average Accuracy",
      value: gamesPlayed > 0 ? `${averageAccuracy}%` : "—",
      detail: gamesPlayed > 0 ? "Overall precision" : "No sessions yet",
    },
  ];

  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card p-2 sm:p-3 shadow-2xs",
        className
      )}
    >
      <div className="grid grid-cols-2 divide-y divide-border/40 sm:grid-cols-5 sm:divide-x sm:divide-y-0">
        {items.map((item, idx) => (
          <div
            key={item.label}
            className={cn(
              "px-3 py-2",
              idx === 0 && "sm:pl-2",
              idx === items.length - 1 && "sm:pr-2"
            )}
          >
            <span className="block text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              {item.label}
            </span>
            <span className="block text-lg font-bold tracking-tight text-foreground tabular-nums mt-0.5 sm:text-xl">
              {item.value}
            </span>
            <span className="block text-[11px] text-muted-foreground/80 mt-0.5 truncate">
              {item.detail}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

