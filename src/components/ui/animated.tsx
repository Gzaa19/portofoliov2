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
 * Automatically reduces animations on mobile devices for better performance
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
    const [isMobile, setIsMobile] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Detect mobile and reduced motion preference
    useEffect(() => {
        // Check for mobile device (max-width: 768px)
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // Check for reduced motion preference
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(motionQuery.matches);

        checkMobile();
        window.addEventListener('resize', checkMobile);

        const handleMotionChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };
        motionQuery.addEventListener('change', handleMotionChange);

        return () => {
            window.removeEventListener('resize', checkMobile);
            motionQuery.removeEventListener('change', handleMotionChange);
        };
    }, []);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // If reduced motion is preferred, show immediately
        if (prefersReducedMotion) {
            setIsVisible(true);
            return;
        }

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
    }, [once, threshold, prefersReducedMotion]);

    // If user prefers reduced motion, render without animation
    if (prefersReducedMotion) {
        return (
            <div ref={ref} className={className}>
                {children}
            </div>
        );
    }

    return (
        <div
            ref={ref}
            className={cn(
                // Base transition - shorter on mobile, heavier on desktop
                isMobile
                    ? "transition-all duration-300 ease-out"
                    : "transition-all duration-1000",
                // Pre-animation state - lighter on mobile
                !isVisible && (isMobile
                    ? "opacity-0 translate-y-4"
                    : "opacity-0 translate-y-16 blur-md scale-[0.92]"),
                // Visible state
                isVisible && "opacity-100 translate-y-0 blur-0 scale-100",
                isVisible && animationClasses[animation],
                isVisible && delayClasses[delay],
                className
            )}
            style={{
                willChange: isVisible ? 'auto' : 'opacity, transform, filter',
                transitionTimingFunction: isMobile
                    ? 'ease-out'
                    : 'cubic-bezier(0.22, 1, 0.36, 1)',
            }}
        >
            {children}
        </div>
    );
}

