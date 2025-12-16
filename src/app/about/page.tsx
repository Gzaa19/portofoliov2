"use client";
import Image from "next/image";
import { useRef, useState } from "react";

// Assets
import aboutFoto from "@/assets/images/About Foto.png";

// Components
import { MapCard } from "@/components/MapCard";
import { SectionCard } from "@/components/SectionCard";
import { ToolboxSection } from "@/components/ToolboxSection";
import { GeminiStarIcon } from "@/components/GeminiStarIcon";
import dynamic from "next/dynamic";

const Antigravity = dynamic(() => import("@/components/Antigravity"), {
    ssr: false,
});

export const About = () => {
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
                    <div className="text-center mb-12 animate-fade-in-up">
                        <h2 className="section-title">
                            About Me
                        </h2>
                    </div>

                    {/* Content Container */}
                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl mx-auto">

                        {/* Left Side - Photo with Border and 3D Tilt */}
                        <div className="flex-shrink-0 animate-fade-in-up delay-200">
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
                                        src={aboutFoto}
                                        alt="Profile Photo"
                                        fill
                                        className="object-cover object-center"
                                        priority
                                    />

                                    {/* Shine overlay effect */}
                                    <div
                                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none transition-opacity duration-300"
                                        style={{
                                            opacity: Math.abs(rotation.y) / 15 * 0.3,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Side - About Content */}
                        <div className="flex-1 animate-fade-in-up delay-400">
                            <SectionCard className="p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <GeminiStarIcon size={32} />
                                    <h3 className="font-serif text-xl md:text-2xl font-bold text-gray-900">
                                        Description
                                    </h3>
                                </div>

                                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                                    With expertise in React, Next.js, Node.js, and various modern technologies,
                                    I create digital solutions that make a difference. I believe in continuous
                                    learning and staying up-to-date with the latest industry trends.
                                </p>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-start">
                                    <a
                                        href="/resume.pdf"
                                        download
                                        className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download Resume
                                    </a>
                                </div>
                            </SectionCard>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tech Stack Section - Now from Database */}
            <ToolboxSection />

            {/* Map Section */}
            <section id="location" className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <MapCard />
                </div>
            </section>
        </>
    );
};

export default About;
