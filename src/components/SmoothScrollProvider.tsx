"use client";

import { useEffect, useRef, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// Context for Lenis instance
const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
    return useContext(LenisContext);
}

/**
 * SmoothScrollProvider - Menggunakan Lenis + GSAP untuk:
 * - Smooth scrolling
 * - GPU-accelerated animations  
 * - ScrollTrigger untuk scroll-based animations
 * 
 * Note: Disabled on admin pages to prevent scroll conflicts
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith("/admin");

    useEffect(() => {
        // Skip Lenis initialization on admin pages
        if (isAdminPage) {
            return;
        }

        // Initialize Lenis smooth scroll
        lenisRef.current = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            touchMultiplier: 2,
        });

        // Connect Lenis with GSAP ScrollTrigger
        lenisRef.current.on("scroll", ScrollTrigger.update);

        // GSAP ticker for Lenis
        gsap.ticker.add((time) => {
            lenisRef.current?.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        // Set default GSAP settings for smooth animations
        gsap.defaults({
            ease: "power3.out",
            duration: 0.8,
        });

        // Global reveal animations for elements with data-animate attribute
        const animateElements = () => {
            // Fade up animation
            gsap.utils.toArray("[data-animate='fade-up']").forEach((el) => {
                gsap.fromTo(
                    el as Element,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        scrollTrigger: {
                            trigger: el as Element,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });

            // Fade in animation
            gsap.utils.toArray("[data-animate='fade-in']").forEach((el) => {
                gsap.fromTo(
                    el as Element,
                    { opacity: 0 },
                    {
                        opacity: 1,
                        duration: 0.6,
                        scrollTrigger: {
                            trigger: el as Element,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });

            // Scale up animation
            gsap.utils.toArray("[data-animate='scale-up']").forEach((el) => {
                gsap.fromTo(
                    el as Element,
                    { opacity: 0, scale: 0.8 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        scrollTrigger: {
                            trigger: el as Element,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });

            // Slide left animation
            gsap.utils.toArray("[data-animate='slide-left']").forEach((el) => {
                gsap.fromTo(
                    el as Element,
                    { opacity: 0, x: 100 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.8,
                        scrollTrigger: {
                            trigger: el as Element,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });

            // Slide right animation  
            gsap.utils.toArray("[data-animate='slide-right']").forEach((el) => {
                gsap.fromTo(
                    el as Element,
                    { opacity: 0, x: -100 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.8,
                        scrollTrigger: {
                            trigger: el as Element,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });
        };

        // Run animations after DOM is ready
        const timeout = setTimeout(animateElements, 100);

        // Cleanup
        return () => {
            clearTimeout(timeout);
            lenisRef.current?.destroy();
            ScrollTrigger.getAll().forEach((t) => t.kill());
            gsap.ticker.remove((time) => {
                lenisRef.current?.raf(time * 1000);
            });
        };
    }, [isAdminPage]);

    return (
        <LenisContext.Provider value={lenisRef.current}>
            {children}
        </LenisContext.Provider>
    );
}

export default SmoothScrollProvider;

