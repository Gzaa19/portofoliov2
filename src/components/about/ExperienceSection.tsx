"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MdBusiness, MdLocationOn, MdCalendarToday } from "react-icons/md";
import { Experience, EMPLOYMENT_TYPE_LABELS, LOCATION_TYPE_LABELS } from "@/types/types";
import { GradientText, GlowCard, FormattedText } from "@/components/ui";
import { GRADIENT_PRESETS, THEME_COLORS } from "@/lib/theme";
import { GeminiStarIcon } from "@/components/GeminiStarIcon";

// Register usage
gsap.registerPlugin(ScrollTrigger);

interface ExperienceSectionProps {
    experiences: Experience[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!experiences.length || window.innerWidth < 1024) return;

        const ctx = gsap.context(() => {
            const section = sectionRef.current;
            const trigger = triggerRef.current;

            if (!section || !trigger) return;

            // Horizontal Scroll Animation
            gsap.fromTo(
                section,
                { x: 0 },
                {
                    x: () => `-${section.scrollWidth - window.innerWidth}px`,
                    ease: "none",
                    scrollTrigger: {
                        trigger: trigger,
                        start: "top top",
                        end: () => `+=${section.scrollWidth}`,
                        scrub: 1,
                        pin: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [experiences]);

    if (!experiences.length) return null;

    return (
        <div ref={containerRef} className="relative w-full py-16 lg:py-0">

            {/* Desktop Horizontal Scroll View */}
            <div ref={triggerRef} className="hidden lg:flex h-screen items-center overflow-hidden relative z-10 w-full">

                {/* Background Text Decoration - Fixed Position (Top Left) */}
                <div className="absolute left-10 top-24 lg:left-20 lg:top-32 z-0 pointer-events-none select-none">
                    <GradientText
                        colors={GRADIENT_PRESETS.cleanSaas}
                        animationSpeed={8}
                        className="text-[6rem] lg:text-[8rem] xl:text-[10rem] font-semibold opacity-10 tracking-[0.2em] whitespace-nowrap font-sans uppercase"
                    >
                        EXPERIENCE
                    </GradientText>
                </div>

                <div
                    ref={sectionRef}
                    className="flex flex-row gap-10 px-[10vw] items-center h-full w-max relative z-10"
                >
                    {/* Intro Card */}
                    <div className="w-[400px] shrink-0 pr-10">
                        <div className="flex items-center gap-3 mb-4">
                            <GeminiStarIcon size={40} color={THEME_COLORS.primaryHex} />
                            <h2
                                className="font-serif text-4xl lg:text-5xl font-bold leading-tight"
                                style={{ color: 'var(--theme-text-heading)' }}
                            >
                                My <br /> Professional <br /> Journey
                            </h2>
                        </div>
                        <p
                            className="text-lg leading-relaxed mt-6"
                            style={{ color: 'var(--theme-text-body)' }}
                        >
                            A timeline of my growth, projects, and the companies I've had the pleasure to work with.
                            Swipe or scroll to explore my path.
                        </p>
                    </div>

                    {/* Experience Cards */}
                    {experiences.map((exp, index) => (
                        <ExperienceCard key={exp.id} experience={exp} index={index} />
                    ))}

                    <div className="w-[20vw]" /> {/* End padding */}
                </div>
            </div>

            {/* Mobile/Tablet Vertical View (Fallback) */}
            <div className="lg:hidden container mx-auto px-4 space-y-12">
                <div className="flex items-center gap-3 mb-8 justify-center text-center">
                    <GeminiStarIcon size={32} color={THEME_COLORS.primaryHex} />
                    <h2
                        className="font-serif text-3xl font-bold"
                        style={{ color: 'var(--theme-text-heading)' }}
                    >
                        My Professional Journey
                    </h2>
                </div>

                <div className="space-y-6">
                    {experiences.map((exp, index) => (
                        <ExperienceCard key={exp.id} experience={exp} index={index} isMobile />
                    ))}
                </div>
            </div>
        </div>
    );
}

function ExperienceCard({ experience, index, isMobile = false }: { experience: Experience; index: number; isMobile?: boolean }) {
    const isActive = experience.isCurrent;

    return (
        <GlowCard
            glowColor="primary"
            className={`
                group p-8 flex flex-col relative bg-white/50 backdrop-blur-sm
                ${isMobile ? "w-full" : "w-[500px] h-[580px] shrink-0 hover:-translate-y-2 transition-transform duration-300"}
            `}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center p-2 overflow-hidden border border-gray-100 shrink-0">
                        {experience.companyLogo ? (
                            <img
                                src={experience.companyLogo}
                                alt={experience.companyName}
                                className="object-contain w-full h-full"
                            />
                        ) : (
                            <MdBusiness className="text-3xl text-gray-400" />
                        )}
                    </div>
                    <div>
                        <h3
                            className="text-xl font-serif font-bold leading-tight mb-1"
                            style={{ color: 'var(--theme-text-heading)' }}
                        >
                            {experience.title}
                        </h3>
                        <div className="font-semibold text-blue-600 text-lg">{experience.companyName}</div>
                    </div>
                </div>
                {isActive && (
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-blue-500/30">
                        Current
                    </span>
                )}
            </div>

            {/* Internal Scrolling Content for Description */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Metadata */}
                <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-6 font-medium">
                    <div className="flex items-center gap-1.5 ">
                        <MdCalendarToday className="text-blue-500" />
                        <span>
                            {new Date(experience.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                            {' - '}
                            {experience.isCurrent
                                ? 'Present'
                                : experience.endDate
                                    ? new Date(experience.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
                                    : ''
                            }
                        </span>
                    </div>
                    {/* Divider dot */}
                    <span className="text-gray-300">•</span>

                    {/* Employment Type */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-blue-600">
                            {EMPLOYMENT_TYPE_LABELS[experience.employmentType] || experience.employmentType.replace('_', ' ')}
                        </span>
                    </div>

                    <span className="text-gray-300">•</span>

                    {/* Location Type */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-blue-600">
                            {LOCATION_TYPE_LABELS[experience.locationType] || experience.locationType.replace('_', ' ')}
                        </span>
                    </div>
                    {experience.location && (
                        <>
                            <span className="text-gray-300">•</span>
                            <span>{experience.location}</span>
                        </>
                    )}
                </div>

                {/* Description - Scrollable if too long */}
                {experience.description && (
                    <div className="overflow-y-auto custom-scrollbar pr-2 mb-6">
                        <FormattedText
                            text={experience.description}
                            className="text-sm"
                            style={{ color: 'var(--theme-text-body)' }}
                        />
                    </div>
                )}
            </div>

            {/* Footer space if needed, or just remove border */}
            <div className="mt-auto"></div>
        </GlowCard>
    );
}
