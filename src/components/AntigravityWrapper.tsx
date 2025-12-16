"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const Antigravity = dynamic(() => import("@/components/Antigravity"), {
    ssr: false,
});

interface AntigravityWrapperProps {
    count?: number;
    magnetRadius?: number;
    ringRadius?: number;
    waveSpeed?: number;
    waveAmplitude?: number;
    particleSize?: number;
    lerpSpeed?: number;
    color?: string;
    autoAnimate?: boolean;
    particleVariance?: number;
    className?: string;
}

/**
 * AntigravityWrapper - Client component wrapper for Antigravity particles
 */
export function AntigravityWrapper({
    count = 2000,
    magnetRadius = 15,
    ringRadius = 10,
    waveSpeed = 0.3,
    waveAmplitude = 0.8,
    particleSize = 0.6,
    lerpSpeed = 0.1,
    color = '#4285F4',
    autoAnimate = true,
    particleVariance = 1,
    className,
}: AntigravityWrapperProps) {
    return (
        <div className={cn("absolute inset-0 z-0", className)}>
            <Antigravity
                count={count}
                magnetRadius={magnetRadius}
                ringRadius={ringRadius}
                waveSpeed={waveSpeed}
                waveAmplitude={waveAmplitude}
                particleSize={particleSize}
                lerpSpeed={lerpSpeed}
                color={color}
                autoAnimate={autoAnimate}
                particleVariance={particleVariance}
            />
        </div>
    );
}

export default AntigravityWrapper;
