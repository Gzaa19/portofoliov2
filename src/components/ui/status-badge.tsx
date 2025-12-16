"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
    text?: string;
    variant?: "available" | "busy" | "away";
    className?: string;
}

const variantStyles = {
    available: {
        dot: "bg-green-500",
        glow: "bg-green-500/20",
        ring: "bg-green-400/30",
    },
    busy: {
        dot: "bg-red-500",
        glow: "bg-red-500/20",
        ring: "bg-red-400/30",
    },
    away: {
        dot: "bg-yellow-500",
        glow: "bg-yellow-500/20",
        ring: "bg-yellow-400/30",
    },
};

/**
 * Animated status badge with pulsing LED effect
 */
export function StatusBadge({
    text = "Available for new projects",
    variant = "available",
    className
}: StatusBadgeProps) {
    const styles = variantStyles[variant];

    return (
        <div className={cn(
            "bg-gray-900 border border-gray-800 px-4 py-1.5 inline-flex items-center gap-4 rounded-lg",
            className
        )}>
            <div className="relative flex items-center justify-center">
                {/* Outer glow ring */}
                <div className={cn("absolute size-6 rounded-full animate-ripple", styles.glow)} />
                {/* Middle pulse ring */}
                <div className={cn("absolute size-4 rounded-full animate-ripple delay-300", styles.ring)} />
                {/* Core LED dot */}
                <div className={cn("relative size-2.5 rounded-full animate-pulse-glow", styles.dot)} />
            </div>
            <span className="text-sm font-medium text-white">{text}</span>
        </div>
    );
}
