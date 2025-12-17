"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionCardProps {
    children: ReactNode;
    className?: string;
    animate?: boolean;
}

/**
 * Section Card - A styled card container for content sections
 * Uses consistent styling with the design system
 */
export function SectionCard({
    children,
    className = "",
    animate = true,
}: SectionCardProps) {
    return (
        <div
            className={cn(
                "relative rounded-3xl bg-black border border-gray-800 overflow-hidden shadow-lg",
                animate && "animate-fade-in-up",
                className
            )}
        >
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}

export default SectionCard;
