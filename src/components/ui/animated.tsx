"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type AnimationType =
    | "fade-in"
    | "fade-in-up"
    | "scale-in"
    | "float";

interface AnimatedProps {
    children: ReactNode;
    animation?: AnimationType;
    delay?: 100 | 200 | 300 | 400 | 500 | 1000 | 1500;
    className?: string;
}

const animationClasses: Record<AnimationType, string> = {
    "fade-in": "animate-fade-in",
    "fade-in-up": "animate-fade-in-up",
    "scale-in": "animate-scale-in",
    "float": "animate-float",
};

const delayClasses: Record<number, string> = {
    100: "delay-100",
    200: "delay-200",
    300: "delay-300",
    400: "delay-400",
    500: "delay-500",
    1000: "delay-1000",
    1500: "delay-1500",
};

/**
 * Animated - Wrapper component for applying CSS animations
 */
export function Animated({
    children,
    animation = "fade-in-up",
    delay,
    className,
}: AnimatedProps) {
    return (
        <div
            className={cn(
                animationClasses[animation],
                delay && delayClasses[delay],
                className
            )}
        >
            {children}
        </div>
    );
}
