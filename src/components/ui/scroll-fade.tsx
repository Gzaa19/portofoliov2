"use client";

import { useScrollVisibility } from "@/hooks/useScrollVisibility";
import { cn } from "@/lib/utils";

interface ScrollFadeProps {
    children: React.ReactNode;
    className?: string;
    /** Direction to fade: 'up' = fade when scrolling up, 'down' = fade when scrolling down */
    direction?: 'up' | 'down' | 'both';
    /** Whether to animate out when scrolled past */
    animateOut?: boolean;
    /** Threshold for visibility detection (0-1) */
    threshold?: number;
    /** Additional styles */
    style?: React.CSSProperties;
}

/**
 * ScrollFade - Component that fades content based on scroll position
 * 
 * Uses 144hz frame-independent animation for smooth transitions
 * 
 * @example
 * <ScrollFade direction="down">
 *   <h1>This will fade when scrolled down</h1>
 * </ScrollFade>
 */
export function ScrollFade({
    children,
    className,
    direction = 'both',
    animateOut = true,
    threshold = 0.1,
    style: customStyle,
}: ScrollFadeProps) {
    const { ref, style, isVisible } = useScrollVisibility<HTMLDivElement>({
        direction,
        animateOut,
        threshold,
    });

    return (
        <div
            ref={ref}
            className={cn("scroll-fade", className)}
            style={{ ...style, ...customStyle }}
            data-visible={isVisible}
        >
            {children}
        </div>
    );
}
