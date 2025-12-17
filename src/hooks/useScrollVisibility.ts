"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseScrollVisibilityOptions {
    /** Threshold for when element is considered "in view" (0-1) */
    threshold?: number;
    /** Root margin for intersection observer */
    rootMargin?: string;
    /** Animation duration in ms */
    animationDuration?: number;
    /** Whether to animate out when scrolled past */
    animateOut?: boolean;
    /** Direction to track: 'up' = fade when scrolling up, 'down' = fade when scrolling down, 'both' */
    direction?: 'up' | 'down' | 'both';
}

interface ScrollVisibilityState {
    isVisible: boolean;
    opacity: number;
    translateY: number;
    scale: number;
}

/**
 * useScrollVisibility - Hook for scroll-based content visibility
 * 
 * Content fades out when scrolled past, fades back in when scrolling back
 * Uses 144hz frame-independent animation
 * 
 * @example
 * const { ref, style, isVisible } = useScrollVisibility();
 * <div ref={ref} style={style}>Content</div>
 */
export function useScrollVisibility<T extends HTMLElement = HTMLDivElement>(
    options: UseScrollVisibilityOptions = {}
) {
    const {
        threshold = 0.1,
        rootMargin = "0px",
        animationDuration = 300,
        animateOut = true,
        direction = 'both',
    } = options;

    const ref = useRef<T>(null);
    const [state, setState] = useState<ScrollVisibilityState>({
        isVisible: true,
        opacity: 1,
        translateY: 0,
        scale: 1,
    });

    const lastScrollY = useRef(0);
    const animationFrameRef = useRef<number | null>(null);
    const targetState = useRef<ScrollVisibilityState>({
        isVisible: true,
        opacity: 1,
        translateY: 0,
        scale: 1,
    });

    // Frame-independent lerp
    const lerp = useCallback((current: number, target: number, factor: number) => {
        const diff = target - current;
        if (Math.abs(diff) < 0.001) return target;
        return current + diff * factor;
    }, []);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        let lastTime = performance.now();

        const animate = (currentTime: number) => {
            // Delta time for 144hz frame independence
            const delta = (currentTime - lastTime) / 1000;
            lastTime = currentTime;
            const deltaScale = Math.min(delta * 60, 3);
            const lerpFactor = 1 - Math.pow(0.1, deltaScale);

            setState(prev => ({
                isVisible: targetState.current.isVisible,
                opacity: lerp(prev.opacity, targetState.current.opacity, lerpFactor),
                translateY: lerp(prev.translateY, targetState.current.translateY, lerpFactor),
                scale: lerp(prev.scale, targetState.current.scale, lerpFactor),
            }));

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                const currentScrollY = window.scrollY;
                const isScrollingDown = currentScrollY > lastScrollY.current;
                lastScrollY.current = currentScrollY;

                const shouldShow = entry.isIntersecting;

                if (shouldShow) {
                    targetState.current = {
                        isVisible: true,
                        opacity: 1,
                        translateY: 0,
                        scale: 1,
                    };
                } else if (animateOut) {
                    // Check scroll direction
                    const shouldAnimate =
                        direction === 'both' ||
                        (direction === 'down' && isScrollingDown) ||
                        (direction === 'up' && !isScrollingDown);

                    if (shouldAnimate) {
                        targetState.current = {
                            isVisible: false,
                            opacity: 0,
                            translateY: isScrollingDown ? -30 : 30,
                            scale: 0.95,
                        };
                    }
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);
        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            observer.disconnect();
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [threshold, rootMargin, animateOut, direction, lerp]);

    const style: React.CSSProperties = {
        opacity: state.opacity,
        transform: `translateY(${state.translateY}px) scale(${state.scale})`,
        transition: 'none', // We handle animation ourselves
        willChange: 'opacity, transform',
    };

    return {
        ref,
        style,
        isVisible: state.isVisible,
        opacity: state.opacity,
    };
}
