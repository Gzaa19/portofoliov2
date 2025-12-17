"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugin
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export type AnimationType =
    | "fade-up"
    | "fade-in"
    | "scale-up"
    | "slide-left"
    | "slide-right"
    | "stagger";

interface UseGsapOptions {
    type?: AnimationType;
    duration?: number;
    delay?: number;
    ease?: string;
    triggerStart?: string;
    staggerAmount?: number;
}

/**
 * Hook untuk menggunakan GSAP animations
 * @example
 * const ref = useGsap<HTMLDivElement>({ type: "fade-up" });
 * return <div ref={ref}>Content</div>
 */
export function useGsap<T extends HTMLElement>({
    type = "fade-up",
    duration = 0.8,
    delay = 0,
    ease = "power3.out",
    triggerStart = "top 85%",
    staggerAmount = 0.1,
}: UseGsapOptions = {}) {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;
        let animation: gsap.core.Tween | gsap.core.Timeline;

        const getAnimation = () => {
            switch (type) {
                case "fade-up":
                    return gsap.fromTo(
                        element,
                        { opacity: 0, y: 50 },
                        {
                            opacity: 1,
                            y: 0,
                            duration,
                            delay,
                            ease,
                            scrollTrigger: {
                                trigger: element,
                                start: triggerStart,
                            },
                        }
                    );

                case "fade-in":
                    return gsap.fromTo(
                        element,
                        { opacity: 0 },
                        {
                            opacity: 1,
                            duration,
                            delay,
                            ease,
                            scrollTrigger: {
                                trigger: element,
                                start: triggerStart,
                            },
                        }
                    );

                case "scale-up":
                    return gsap.fromTo(
                        element,
                        { opacity: 0, scale: 0.8 },
                        {
                            opacity: 1,
                            scale: 1,
                            duration,
                            delay,
                            ease,
                            scrollTrigger: {
                                trigger: element,
                                start: triggerStart,
                            },
                        }
                    );

                case "slide-left":
                    return gsap.fromTo(
                        element,
                        { opacity: 0, x: 100 },
                        {
                            opacity: 1,
                            x: 0,
                            duration,
                            delay,
                            ease,
                            scrollTrigger: {
                                trigger: element,
                                start: triggerStart,
                            },
                        }
                    );

                case "slide-right":
                    return gsap.fromTo(
                        element,
                        { opacity: 0, x: -100 },
                        {
                            opacity: 1,
                            x: 0,
                            duration,
                            delay,
                            ease,
                            scrollTrigger: {
                                trigger: element,
                                start: triggerStart,
                            },
                        }
                    );

                case "stagger":
                    return gsap.fromTo(
                        element.children,
                        { opacity: 0, y: 30 },
                        {
                            opacity: 1,
                            y: 0,
                            duration,
                            delay,
                            ease,
                            stagger: staggerAmount,
                            scrollTrigger: {
                                trigger: element,
                                start: triggerStart,
                            },
                        }
                    );

                default:
                    return gsap.fromTo(
                        element,
                        { opacity: 0 },
                        { opacity: 1, duration }
                    );
            }
        };

        animation = getAnimation();

        return () => {
            animation?.kill();
            ScrollTrigger.getAll()
                .filter((t) => t.trigger === element)
                .forEach((t) => t.kill());
        };
    }, [type, duration, delay, ease, triggerStart, staggerAmount]);

    return ref;
}

/**
 * Hook untuk membuat timeline GSAP
 */
export function useGsapTimeline() {
    const timeline = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        timeline.current = gsap.timeline({ paused: true });

        return () => {
            timeline.current?.kill();
        };
    }, []);

    return timeline;
}

export default useGsap;
