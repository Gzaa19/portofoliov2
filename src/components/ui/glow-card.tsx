"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
    glowColor?: string;
    glowPosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "center";
    glowSize?: "sm" | "md" | "lg";
    animate?: boolean;
}

/**
 * GlowCard - A card with subtle glow effect
 * Used for content sections with glassmorphism effect
 * 
 * @example
 * <GlowCard glowColor="blue" glowPosition="top-right">
 *   Content here
 * </GlowCard>
 */
function GlowCard({
    children,
    className,
    glowColor = "blue",
    glowPosition = "top-right",
    glowSize = "md",
    animate = true,
    ...props
}: GlowCardProps) {
    const glowColors: Record<string, string> = {
        blue: "bg-blue-500/10",
        purple: "bg-purple-500/10",
        green: "bg-green-500/10",
        pink: "bg-pink-500/10",
        orange: "bg-orange-500/10",
    };

    const positions: Record<string, string> = {
        "top-right": "-translate-y-1/2 translate-x-1/2 top-0 right-0",
        "top-left": "-translate-y-1/2 -translate-x-1/2 top-0 left-0",
        "bottom-right": "translate-y-1/2 translate-x-1/2 bottom-0 right-0",
        "bottom-left": "translate-y-1/2 -translate-x-1/2 bottom-0 left-0",
        "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    };

    const sizes: Record<string, string> = {
        sm: "w-32 h-32",
        md: "w-64 h-64",
        lg: "w-96 h-96",
    };

    return (
        <div
            className={cn(
                "relative rounded-3xl bg-black border border-gray-800 overflow-hidden shadow-lg",
                animate && "animate-fade-in-up",
                className
            )}
            {...props}
        >
            {/* Glow effect */}
            <div
                className={cn(
                    "absolute blur-3xl rounded-full pointer-events-none",
                    glowColors[glowColor] || glowColors.blue,
                    positions[glowPosition],
                    sizes[glowSize]
                )}
            />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}

export { GlowCard };
