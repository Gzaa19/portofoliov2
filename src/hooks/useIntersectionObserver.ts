import { useEffect, useRef, useState, RefObject } from "react";

interface UseIntersectionObserverOptions {
    threshold?: number | number[];
    root?: Element | null;
    rootMargin?: string;
    freezeOnceVisible?: boolean;
}

interface UseIntersectionObserverReturn<T extends HTMLElement> {
    ref: RefObject<T | null>;
    isIntersecting: boolean;
}

/**
 * useIntersectionObserver - Hook to detect when element enters viewport
 * 
 * @param options - Intersection observer options
 * @returns Object containing ref and isIntersecting state
 * 
 * @example
 * const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.5 });
 * 
 * <div ref={ref} className={isIntersecting ? 'animate-in' : ''}>
 *   Content
 * </div>
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
    options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn<T> {
    const {
        threshold = 0,
        root = null,
        rootMargin = "0px",
        freezeOnceVisible = false,
    } = options;

    const ref = useRef<T | null>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);
    const frozen = useRef(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // If already frozen, don't observe
        if (frozen.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const isElementIntersecting = entry.isIntersecting;

                setIsIntersecting(isElementIntersecting);

                // Once visible and freeze enabled, stop observing
                if (isElementIntersecting && freezeOnceVisible) {
                    frozen.current = true;
                    observer.disconnect();
                }
            },
            { threshold, root, rootMargin }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [threshold, root, rootMargin, freezeOnceVisible]);

    return { ref, isIntersecting };
}
