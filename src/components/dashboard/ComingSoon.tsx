import { Construction } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Placeholder body for a dashboard section that has routing + a data shape
 * already, but no built experience yet (mock tests, bookmarks, achievements,
 * settings, and every non-live company page). Swap the child page's content
 * in when the real feature lands — the route itself won't need to move.
 */
export function ComingSoon({
  title,
  description,
  backHref = "/dashboard",
  backLabel = "Back to dashboard",
}: {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/10 px-6 py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Construction className="h-7 w-7" />
      </div>
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description ?? "We're building this out. Check back soon."}
      </p>
      <Button asChild variant="outline" className="mt-6">
        <Link href={backHref}>{backLabel}</Link>
      </Button>
    </div>
  );
}
