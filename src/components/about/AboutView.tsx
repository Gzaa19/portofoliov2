"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { SectionCard } from "@/components/SectionCard";
import { ToolboxSection, ToolboxCategory } from "@/components/ToolboxSection";
import { MapCard } from "@/components/MapCard";
import { GeminiStarIcon } from "@/components/GeminiStarIcon";
import { Animated } from "@/components/ui/animated";
import aboutFoto from "@/assets/images/About Foto.png";

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
}

export const AboutView = ({ initialData, toolboxCategories }: AboutViewProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const x = (e.clientX - centerX) / rect.width;
        const y = (e.clientY - centerY) / rect.height;

        setRotation({
            x: y * -15,
            y: x * 15,
        });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
    };

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
                        color={'#4285F4'}
                        autoAnimate={true}
                        particleVariance={2}
                    />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    {/* Section Title */}
                    <Animated animation="fade-in-up" className="text-center mb-12">
                        <h2 className="section-title">
                            About Me
                        </h2>
                    </Animated>

                    {/* Content Container */}
                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl mx-auto">

                        {/* Left Side - Photo with Border and 3D Tilt */}
                        <Animated animation="scale-in" delay={200} className="shrink-0">
                            <div
                                ref={cardRef}
                                className="relative"
                                style={{ perspective: 1000 }}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                {/* Card container with shadow and 3D effect */}
                                <div
                                    className="relative w-[320px] h-[320px] md:w-[380px] md:h-[380px] lg:w-[420px] lg:h-[420px] overflow-hidden rounded-3xl bg-white shadow-2xl shadow-black/30 cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.02]"
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
                            <SectionCard className="p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <GeminiStarIcon size={32} />
                                    <h3 className="font-serif text-xl md:text-2xl font-bold text-gray-900">
                                        Description
                                    </h3>
                                </div>

                                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6 whitespace-pre-wrap">
                                    {description}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-start">
                                    <a
                                        href={resumeLink}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download Resume
                                    </a>
                                </div>
                            </SectionCard>
                        </Animated>
                    </div>
                </div>
            </section>

            {/* Tech Stack Section - Now from Database */}
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
