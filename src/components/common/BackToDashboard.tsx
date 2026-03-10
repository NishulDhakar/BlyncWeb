'use client';

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface BackToDashboardProps {
    className?: string;
}

export default function BackToDashboard({ className }: BackToDashboardProps) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push("/")}
            className={cn(
                "group flex items-center gap-2 px-5 py-2.5 rounded-full text-black bg-white backdrop-blur-md border border-border/50 text-sm font-medium hover:text-white/80 hover:bg-accent/10 transition-all hover:pl-4 hover:pr-6 shadow-sm hover:shadow-md",
                className
            )}
        >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
        </button>
    );
}
