"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useRef, useState, useCallback } from "react";

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
    /** Enable scroll-based fade (fade out when scrolled past) */
    scrollFade?: boolean;
    /** High performance mode for 144hz displays */
    highPerformance?: boolean;
}

const animationClasses: Record<AnimationType, string> = {
    "fade-in": "animate-fade-in",
    "fade-in-up": "animate-fade-in-up",
    "scale-in": "animate-scale-in",
    "slide-in-right": "animate-slide-in-right",
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
 * 
 * Features:
 * - Automatically reduces animations on mobile devices
 * - 144hz frame-independent animation support
 * - Optional scroll-based fade (content fades when scrolled past)
 */
export function Animated({
    children,
    animation = "fade-in-up",
    delay = 0,
    className,
    threshold = 0.1,
    once = true,
    scrollFade = false,
    highPerformance = true,
}: AnimatedProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // High performance animation state
    const [animState, setAnimState] = useState({
        opacity: 0,
        translateY: 16,
        scale: 0.92,
        blur: 8,
    });
    const animFrameRef = useRef<number | null>(null);
    const targetState = useRef({
        opacity: 0,
        translateY: 16,
        scale: 0.92,
        blur: 8,
    });

    // Frame-independent lerp
    const lerp = useCallback((current: number, target: number, factor: number) => {
        const diff = target - current;
        if (Math.abs(diff) < 0.001) return target;
        return current + diff * factor;
    }, []);

    // Detect mobile and reduced motion preference
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

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

    // High performance 144hz animation loop
    useEffect(() => {
        if (!highPerformance || prefersReducedMotion) return;

        let lastTime = performance.now();

        const animate = (currentTime: number) => {
            const delta = (currentTime - lastTime) / 1000;
            lastTime = currentTime;

            // 144hz frame-independent factor
            const deltaScale = Math.min(delta * 60, 3);
            const lerpFactor = 1 - Math.pow(0.15, deltaScale);

            setAnimState(prev => ({
                opacity: lerp(prev.opacity, targetState.current.opacity, lerpFactor),
                translateY: lerp(prev.translateY, targetState.current.translateY, lerpFactor),
                scale: lerp(prev.scale, targetState.current.scale, lerpFactor),
                blur: lerp(prev.blur, targetState.current.blur, lerpFactor),
            }));

            animFrameRef.current = requestAnimationFrame(animate);
        };

        animFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
        };
    }, [highPerformance, prefersReducedMotion, lerp]);

    // Intersection observer for visibility
    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        if (prefersReducedMotion) {
            setIsVisible(true);
            targetState.current = { opacity: 1, translateY: 0, scale: 1, blur: 0 };
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    targetState.current = { opacity: 1, translateY: 0, scale: 1, blur: 0 };
                    if (once && element) {
                        observer.unobserve(element);
                    }
                } else if (!once || scrollFade) {
                    setIsVisible(false);
                    targetState.current = {
                        opacity: 0,
                        translateY: isMobile ? 8 : 16,
                        scale: isMobile ? 0.98 : 0.92,
                        blur: isMobile ? 0 : 8
                    };
                }
            },
            { threshold }
        );

        observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, [once, threshold, prefersReducedMotion, scrollFade, isMobile]);

    // If user prefers reduced motion, render without animation
    if (prefersReducedMotion) {
        return (
            <div ref={ref} className={className}>
                {children}
            </div>
        );
    }

    // High performance mode - use requestAnimationFrame
    if (highPerformance) {
        return (
            <div
                ref={ref}
                className={cn(className)}
                style={{
                    opacity: animState.opacity,
                    transform: `translateY(${animState.translateY}px) scale(${animState.scale})`,
                    filter: isMobile ? 'none' : `blur(${animState.blur}px)`,
                    willChange: isVisible ? 'auto' : 'opacity, transform, filter',
                }}
            >
                {children}
            </div>
        );
    }

    // Fallback to CSS transitions
    return (
        <div
            ref={ref}
            className={cn(
                isMobile
                    ? "transition-all duration-300 ease-out"
                    : "transition-all duration-1000",
                !isVisible && (isMobile
                    ? "opacity-0 translate-y-4"
                    : "opacity-0 translate-y-16 blur-md scale-[0.92]"),
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
