import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Zap,
  Calendar,
  Share2,
  Check,
  Award,
} from "lucide-react";
import { formatMemberSince } from "@/app/(root)/profile/profile-utils";
import type { User } from "@/types/user";

export interface ProfileHeaderProps {
  user: User & { isPro?: boolean };
  percentile: string;
  memberSince?: Date | string;
  onSignOut: () => void;
}

export function ProfileHeader({
  user,
  percentile,
  memberSince,
  onSignOut,
}: ProfileHeaderProps) {
  const [copied, setCopied] = useState(false);

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user.email[0]?.toUpperCase() ?? "U";

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Avatar & identity */}
        <div className="flex items-center gap-3.5 min-w-0">
          <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border border-border/60 shrink-0">
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? "Candidate"} />
            <AvatarFallback className="bg-muted text-sm sm:text-base font-semibold text-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
                {user.name ?? "Assessment Candidate"}
              </h1>
              {user.isPro ? (
                <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/25 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                  <Zap className="h-2.5 w-2.5" />
                  PRO
                </span>
              ) : (
                <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  Free Plan
                </span>
              )}
            </div>

            <p className="truncate text-xs text-muted-foreground mt-0.5">{user.email}</p>

            <div className="mt-1 flex flex-wrap items-center gap-2.5 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3 opacity-70" />
                Joined {formatMemberSince(memberSince)}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 font-medium text-foreground">
                <Award className="h-3 w-3 text-primary" />
                {percentile}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="h-8 border-border/60 text-xs font-medium hover:bg-muted/70 cursor-pointer shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
                Copied
              </>
            ) : (
              <>
                <Share2 className="mr-1.5 h-3.5 w-3.5" />
                Share
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className="h-8 text-xs font-medium text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600 cursor-pointer"
          >
            <LogOut className="mr-1.5 h-3.5 w-3.5" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}

