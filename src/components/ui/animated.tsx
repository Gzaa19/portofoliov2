"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useRef, useState } from "react";

type AnimationType =
    | "fade-in"
    | "fade-in-up"
    | "scale-in"
    | "slide-in-right"
    | "slide-in-left"
    | "float";

interface AnimatedProps {
    children: ReactNode;
    animation?: AnimationType;
    delay?: 0 | 100 | 200 | 300 | 400 | 500 | 1000 | 1500;
    className?: string;
    threshold?: number;
    once?: boolean;
}

const animationClasses: Record<AnimationType, string> = {
    "fade-in": "animate-fade-in",
    "fade-in-up": "animate-fade-in-up",
    "scale-in": "animate-scale-in",
    "slide-in-right": "animate-slide-in-right", // Need to ensure these exist or map them
    "slide-in-left": "animate-slide-in-left",
    "float": "animate-float",
};

const delayClasses: Record<number, string> = {
    0: "",
    100: "delay-100",
    200: "delay-200",
    300: "delay-300",
    400: "delay-400",
    500: "delay-500",
    1000: "delay-1000",
    1500: "delay-1500",
};

/**
 * Animated - Wrapper component for applying CSS animations on scroll
 */
export function Animated({
    children,
    animation = "fade-in-up",
    delay = 0,
    className,
    threshold = 0.1,
    once = true,
}: AnimatedProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once && element) {
                        observer.unobserve(element);
                    }
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold }
        );

        observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, [once, threshold]);

    return (
        <div
            ref={ref}
            className={cn(
                // Base state (hidden) until visible
                "transition-opacity duration-500",
                !isVisible && "opacity-0 translate-y-8 invisible", // Simple pre-animation state
                isVisible && animationClasses[animation],
                isVisible && delayClasses[delay],
                className
            )}
        >
            {children}
        </div>
    );
}

