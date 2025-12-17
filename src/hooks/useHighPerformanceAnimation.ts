import { useCallback, useRef } from "react";

/**
 * useHighPerformanceAnimation - Hook for 144hz frame-independent animations
 * 
 * Provides delta-time based animation helpers that work consistently
 * across all refresh rates (60hz, 120hz, 144hz, 240hz)
 */
export function useHighPerformanceAnimation() {
    const lastTimeRef = useRef<number>(0);
    const targetFps = 60; // Base frame rate for calculations

    /**
     * Calculate delta scale for frame-independent animation
     * @param currentTime - Current timestamp from requestAnimationFrame
     * @returns deltaScale - Multiplier for animations (1.0 at 60fps, 0.5 at 120fps, etc.)
     */
    const getDeltaScale = useCallback((currentTime: number) => {
        const delta = lastTimeRef.current ? (currentTime - lastTimeRef.current) / 1000 : 1 / targetFps;
        lastTimeRef.current = currentTime;
        return Math.min(delta * targetFps, 3); // Cap at 3x for safety
    }, []);

    /**
     * Frame-independent lerp (linear interpolation)
     * @param current - Current value
     * @param target - Target value
     * @param speed - Speed factor (0-1)
     * @param deltaScale - Delta scale from getDeltaScale
     */
    const lerp = useCallback((current: number, target: number, speed: number, deltaScale: number) => {
        const factor = 1 - Math.pow(1 - speed, deltaScale);
        return current + (target - current) * factor;
    }, []);

    /**
     * Frame-independent smooth damp
     * @param current - Current value
     * @param target - Target value
     * @param smoothTime - Approximate time to reach target
     * @param deltaScale - Delta scale from getDeltaScale
     */
    const smoothDamp = useCallback((current: number, target: number, smoothTime: number, deltaScale: number) => {
        const factor = 1 - Math.pow(smoothTime, deltaScale);
        return current + (target - current) * factor;
    }, []);

    /**
     * Ease-out animation (decelerating)
     */
    const easeOut = useCallback((t: number) => {
        return 1 - Math.pow(1 - t, 3);
    }, []);

    /**
     * Ease-in-out animation
     */
    const easeInOut = useCallback((t: number) => {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }, []);

    return {
        getDeltaScale,
        lerp,
        smoothDamp,
        easeOut,
        easeInOut,
        targetFps,
    };
}
