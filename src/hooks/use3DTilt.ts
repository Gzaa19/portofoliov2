import { useRef, useState, useCallback } from "react";

interface TiltState {
    x: number;
    y: number;
}

interface Use3DTiltOptions {
    maxTilt?: number;
    perspective?: number;
}

/**
 * use3DTilt - Custom hook for 3D tilt effect on mouse move
 * 
 * @param options - Configuration options
 * @returns Object containing ref, rotation state, and event handlers
 * 
 * @example
 * const { ref, rotation, handleMouseMove, handleMouseLeave } = use3DTilt();
 * 
 * <div 
 *   ref={ref}
 *   onMouseMove={handleMouseMove}
 *   onMouseLeave={handleMouseLeave}
 *   style={{ 
 *     transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` 
 *   }}
 * >
 *   Content
 * </div>
 */
export function use3DTilt(options: Use3DTiltOptions = {}) {
    const { maxTilt = 15, perspective = 1000 } = options;

    const ref = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState<TiltState>({ x: 0, y: 0 });

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!ref.current) return;

            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const x = (e.clientX - centerX) / rect.width;
            const y = (e.clientY - centerY) / rect.height;

            setRotation({
                x: y * -maxTilt,
                y: x * maxTilt,
            });
        },
        [maxTilt]
    );

    const handleMouseLeave = useCallback(() => {
        setRotation({ x: 0, y: 0 });
    }, []);

    return {
        ref,
        rotation,
        handleMouseMove,
        handleMouseLeave,
        perspective,
    };
}
