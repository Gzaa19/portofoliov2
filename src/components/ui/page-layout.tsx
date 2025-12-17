"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const Antigravity = dynamic(() => import("@/components/Antigravity"), {
    ssr: false,
});

interface PageLayoutProps {
    children: React.ReactNode;
    className?: string;
    particleCount?: number;
    showParticles?: boolean;
    containerClassName?: string;
}

/**
 * PageLayout - Page wrapper with Antigravity particles background
 * 
 * @example
 * <PageLayout particleCount={800}>
 *   <PageHeader title="My Page" />
 *   <Content />
 * </PageLayout>
 */
function PageLayout({
    children,
    className,
    particleCount = 800,
    showParticles = true,
    containerClassName,
}: PageLayoutProps) {
    return (
        <div className={cn("min-h-screen py-32 px-4 relative", className)}>
            {/* Antigravity Particles Background */}
            {showParticles && (
                <div className="absolute inset-0 z-0">
                    <Antigravity
                        count={particleCount}
                        magnetRadius={18}
                        ringRadius={12}
                        waveSpeed={0.3}
                        waveAmplitude={1.2}
                        particleSize={0.8}
                        lerpSpeed={0.08}
                        color="#4285F4"
                        autoAnimate={true}
                        particleVariance={2}
                    />
                </div>
            )}

            {/* Content Container */}
            <div
                className={cn(
                    "container mx-auto max-w-6xl relative z-10 pointer-events-none",
                    containerClassName
                )}
            >
                {children}
            </div>
        </div>
    );
}

export { PageLayout };
