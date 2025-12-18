"use client";

import { cn } from "@/lib/utils";

interface GeminiStarIconProps {
    className?: string;
    size?: number;
    color?: string;
}

/**
 * Gemini Star Icon - SVG icon with gradient or solid color
 */
export function GeminiStarIcon({
    className,
    size = 24,
    color,
}: GeminiStarIconProps) {
    // Use unique ID for gradient to avoid conflicts
    const gradientId = `geminiStarGradient-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <svg
            className={cn("shrink-0", className)}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {!color && (
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4285F4" />
                        <stop offset="60%" stopColor="#4285F4" />
                        <stop offset="75%" stopColor="#34A853" />
                        <stop offset="88%" stopColor="#FBBC05" />
                        <stop offset="100%" stopColor="#EA4335" />
                    </linearGradient>
                </defs>
            )}
            <path
                d="M12 1C12 1 12 8 10 10C8 12 1 12 1 12C1 12 8 12 10 14C12 16 12 23 12 23C12 23 12 16 14 14C16 12 23 12 23 12C23 12 16 12 14 10C12 8 12 1 12 1Z"
                fill={color || `url(#${gradientId})`}
            />
        </svg>
    );
}

export default GeminiStarIcon;

