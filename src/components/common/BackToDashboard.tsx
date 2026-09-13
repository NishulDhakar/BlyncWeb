import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackToDashboardProps {
  href?: string;
  label?: string;
  className?: string;
}

export default function BackToDashboard({
  href = "/",
  label = "Back to Home",
  className,
}: BackToDashboardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 px-4 py-2 rounded-full text-muted-foreground bg-card/60 backdrop-blur-md border border-border/50 text-xs sm:text-sm font-medium hover:text-foreground hover:bg-accent/40 transition-all hover:pl-3.5 hover:pr-4.5 shadow-sm hover:shadow-md",
        className
      )}
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      <span>{label}</span>
    </Link>
  );
}
