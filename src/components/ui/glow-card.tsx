"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
    glowColor?: string;
    glowPosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "center";
    glowSize?: "sm" | "md" | "lg";
    animate?: boolean;
    variant?: "default" | "themed";
}

/**
 * GlowCard - A card with subtle glow effect
 * Uses theme variables from globals.css for consistent styling
 * 
 * @example
 * <GlowCard glowColor="primary" glowPosition="top-right">
 *   Content here
 * </GlowCard>
 */
function GlowCard({
    children,
    className,
    glowColor = "primary",
    glowPosition = "top-right",
    glowSize = "md",
    animate = true,
    variant = "themed",
    ...props
}: GlowCardProps) {
    const glowColors: Record<string, string> = {
        primary: "bg-[var(--theme-primary)]/15",
        blue: "bg-blue-500/15",
        sky: "bg-sky-200/30",
        cyan: "bg-cyan-200/25",
        purple: "bg-purple-500/15",
        violet: "bg-violet-500/20",
        green: "bg-green-500/15",
        pink: "bg-pink-500/15",
        orange: "bg-orange-500/15",
        white: "bg-white/20",
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

    // Use themed style (reads from CSS variables in globals.css)
    const cardStyle: React.CSSProperties = variant === "themed" ? {
        background: "var(--theme-card-bg)",
        borderColor: "var(--theme-card-border)",
        color: "var(--theme-card-text)",
    } : {};

    return (
        <div
            className={cn(
                // Base styles
                "relative rounded-3xl overflow-hidden",
                // Border
                "border",
                // Backdrop blur for glassmorphism
                "backdrop-blur-sm",
                // Shadow
                variant === "themed"
                    ? "shadow-sm"
                    : "bg-black border-gray-800 shadow-lg",
                animate && "animate-fade-in-up",
                className
            )}
            style={cardStyle}
            {...props}
        >
            {/* Glow effect */}
            <div
                className={cn(
                    "absolute blur-3xl rounded-full pointer-events-none opacity-60",
                    glowColors[glowColor] || glowColors.primary,
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


