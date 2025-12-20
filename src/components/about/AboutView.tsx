"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { GlowCard, Animated, GradientText } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { ToolboxSection } from "@/components/ToolboxSection";
import { MapCard } from "@/components/MapCard";
import { GeminiStarIcon } from "@/components/GeminiStarIcon";
import { DownloadIcon } from "@/components/icons";
import { use3DTilt } from "@/hooks";
import { GRADIENT_PRESETS, THEME_COLORS } from "@/lib/theme";
import aboutFoto from "@/assets/images/About Foto.png";
import { ExperienceSection } from "./ExperienceSection";
import type { ToolboxCategory, Experience } from "@/types/types";

const Antigravity = dynamic(() => import("@/components/Antigravity"), {
    ssr: false,
});

interface AboutViewProps {
    initialData?: {
        description?: string;
        photoUrl?: string;
        resumeUrl?: string;
    };
    toolboxCategories?: ToolboxCategory[];
    experiences?: Experience[];
}

export const AboutView = ({ initialData, toolboxCategories, experiences = [] }: AboutViewProps) => {
    // Use custom 3D tilt hook
    const { ref: cardRef, rotation, handleMouseMove, handleMouseLeave, perspective } = use3DTilt({
        maxTilt: 15,
        perspective: 1000,
    });

    // Use DB data or fallback
    const description = initialData?.description || "With expertise in React, Next.js, Node.js, and various modern technologies, I create digital solutions that make a difference. I believe in continuous learning and staying up-to-date with the latest industry trends.";
    const photoSrc = initialData?.photoUrl || aboutFoto;
    const resumeLink = initialData?.resumeUrl || "/resume.pdf";

    return (
        <>
            <section id="about" className="py-32 overflow-x-clip relative">
                {/* Antigravity Particles */}
                <div className="absolute inset-0 z-0">
                    <Antigravity
                        count={3000}
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

                <div className="container mx-auto px-4 relative z-10">
                    {/* Section Title */}
                    <Animated animation="fade-in-up" className="text-center mb-12">
                        <GradientText
                            colors={GRADIENT_PRESETS.cleanSaas}
                            animationSpeed={6}
                            className="section-title"
                        >
                            About Me
                        </GradientText>
                    </Animated>

                    {/* Content Container */}
                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl mx-auto">
                        {/* Left Side - Photo with 3D Tilt */}
                        <Animated animation="scale-in" delay={200} className="shrink-0 w-full md:w-auto">
                            <div
                                ref={cardRef}
                                className="relative"
                                style={{ perspective }}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div
                                    className="relative w-full aspect-square md:w-[380px] md:h-[380px] lg:w-[420px] lg:h-[420px] overflow-hidden rounded-3xl bg-white shadow-2xl shadow-black/30 cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.02]"
                                    style={{
                                        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                                        transformStyle: "preserve-3d",
                                    }}
                                >
                                    <Image
                                        src={photoSrc}
                                        alt="Profile Photo"
                                        fill
                                        className="object-cover object-center"
                                        priority
                                    />

                                    {/* Shine overlay effect */}
                                    <div
                                        className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent pointer-events-none transition-opacity duration-300"
                                        style={{
                                            opacity: Math.abs(rotation.y) / 15 * 0.3,
                                        }}
                                    />
                                </div>
                            </div>
                        </Animated>

                        {/* Right Side - About Content */}
                        <Animated animation="fade-in-up" delay={400} className="flex-1">
                            <GlowCard glowColor="primary" glowPosition="top-right" className="p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-5">
                                    <GeminiStarIcon size={32} color={THEME_COLORS.primaryHex} />
                                    <h3
                                        className="font-serif text-xl md:text-2xl font-bold"
                                        style={{ color: 'var(--theme-text-heading)' }}
                                    >
                                        Description
                                    </h3>
                                </div>

                                <p
                                    className="text-sm md:text-base mb-8 whitespace-pre-wrap"
                                    style={{
                                        color: 'var(--theme-text-body)',
                                        lineHeight: '1.85',
                                        letterSpacing: '0.01em'
                                    }}
                                >
                                    {description}
                                </p>

                                {/* Action Buttons - Themed */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-start">
                                    <Button asChild size="lg" className="group rounded-xl font-semibold text-sm">
                                        <a
                                            href={resumeLink}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <DownloadIcon className="mr-2 w-4 h-4 transition-transform group-hover:scale-110" />
                                            Download Resume
                                        </a>
                                    </Button>
                                </div>
                            </GlowCard>
                        </Animated>
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            {experiences.length > 0 && (
                <ExperienceSection experiences={experiences} />
            )}

            {/* Tech Stack Section */}
            <Animated animation="fade-in-up" delay={200} threshold={0.2}>
                <ToolboxSection categories={toolboxCategories} />
            </Animated>

            {/* Map Section */}
            <section id="location" className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <Animated animation="fade-in-up" delay={300} threshold={0.2}>
                        <MapCard />
                    </Animated>
                </div>
            </section>
        </>
    );
};
