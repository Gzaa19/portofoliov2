"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MdSchool, MdCalendarToday } from "react-icons/md";
import { Education } from "@/types/types";
import { GlowCard, FormattedText } from "@/components/ui";
import { THEME_COLORS } from "@/lib/theme";
import { GeminiStarIcon } from "@/components/GeminiStarIcon";

// Register usage
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface EducationSectionProps {
    educations: Education[];
}

export function EducationSection({ educations }: EducationSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!educations.length || !containerRef.current) return;

        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray<HTMLElement>(".education-card");
            const dots = gsap.utils.toArray<HTMLElement>(".timeline-dot");

            // 1. Line Drawing Animation
            gsap.fromTo(lineRef.current,
                { height: "0%" },
                {
                    height: "100%",
                    duration: 1.5,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 60%",
                        end: "bottom 80%",
                        scrub: 1,
                    }
                }
            );

            // 2. Cards & Dots Sequence Animation
            cards.forEach((card, i) => {
                // Tentukan arah datang animasi (kiri atau kanan)
                const isEven = i % 2 === 0;
                const xOffset = window.innerWidth >= 768 ? (isEven ? -50 : 50) : 0;
                // Untuk mobile (width < 768), animasi dari bawah (y), untuk desktop dari samping (x)

                const animVars = window.innerWidth >= 768
                    ? { x: xOffset, opacity: 0 }
                    : { y: 30, opacity: 0 };

                const targetVars = window.innerWidth >= 768
                    ? { x: 0, opacity: 1 }
                    : { y: 0, opacity: 1 };

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                });

                // Dot appears first (pop effect)
                if (dots[i]) {
                    tl.fromTo(dots[i],
                        { scale: 0, opacity: 0 },
                        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
                    );
                }

                // Card slides in
                tl.fromTo(card,
                    animVars,
                    {
                        ...targetVars,
                        duration: 0.6,
                        ease: "power3.out"
                    },
                    "-=0.2"
                );
            });

        }, containerRef);

        return () => ctx.revert();
    }, [educations]);

    if (!educations.length) return null;

    return (
        <section ref={containerRef} className="py-20 md:py-32 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">

                {/* Header */}
                <div className="flex items-center gap-3 mb-16 justify-center text-center">
                    <GeminiStarIcon size={36} color={THEME_COLORS.primaryHex} />
                    <h2
                        className="font-serif text-3xl md:text-5xl font-bold tracking-tight"
                        style={{ color: 'var(--theme-text-heading)' }}
                    >
                        Education Journey
                    </h2>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Vertical Line - Royal Blue */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gray-200/20 -translate-x-1/2 rounded-full hidden md:block"></div> {/* Background Track */}
                    <div
                        ref={lineRef}
                        className="absolute left-[19px] md:left-1/2 top-0 w-[2px] md:w-1 bg-[#4169E1] -translate-x-1/2 rounded-full shadow-[0_0_15px_rgba(65,105,225,0.6)] z-0"
                    ></div>

                    <div className="space-y-12 md:space-y-24 relative">
                        {educations.map((edu, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <div key={edu.id} className={`relative flex items-center md:justify-between ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-0 pl-12 md:pl-0 group`}>

                                    {/* Timeline Dot (Center) */}
                                    <div className="timeline-dot absolute left-[19px] md:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-4 h-4 rounded-full bg-[#4169E1] border-4 border-[#0f172a] shadow-[0_0_0_4px_rgba(65,105,225,0.3)]"></div>

                                    {/* Date Label (Opposite Side for Desktop) */}
                                    <div className={`hidden md:block w-5/12 text-center md:text-${isEven ? 'right' : 'left'} px-6`}>
                                        <span className="inline-block py-2 px-4 rounded-full bg-white/5 border border-white/10 text-[#4169E1] font-mono font-bold text-sm tracking-wider shadow-sm backdrop-blur-md">
                                            {new Date(edu.startDate).getFullYear()} - {edu.isCurrent ? 'Present' : (edu.endDate ? new Date(edu.endDate).getFullYear() : '')}
                                        </span>
                                    </div>

                                    {/* Content Card */}
                                    <div className="education-card w-full md:w-5/12 relative">
                                        <GlowCard
                                            glowColor="primary" // Pakai primary/blue untuk konsistensi dengan Royal Blue
                                            className="p-6 md:p-8 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#4169E1]/50 transition-all duration-300 group-hover:shadow-[0_10px_40px_-10px_rgba(65,105,225,0.15)]"
                                        >
                                            {/* Mobile Date (Visible only on Mobile) */}
                                            <div className="md:hidden mb-4">
                                                <span className="inline-block py-1.5 px-3 rounded-full bg-blue-500/10 text-[#4169E1] text-xs font-bold border border-blue-500/20">
                                                    {new Date(edu.startDate).getFullYear()} - {edu.isCurrent ? 'Present' : (edu.endDate ? new Date(edu.endDate).getFullYear() : '')}
                                                </span>
                                            </div>

                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-bold leading-tight mb-1" style={{ color: 'var(--theme-text-heading)' }}>
                                                        {edu.school}
                                                    </h3>
                                                    <div className="text-lg text-[#4169E1] font-medium">
                                                        {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                                                    </div>
                                                </div>

                                                {/* Logo */}
                                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white flex items-center justify-center p-2 shrink-0 shadow-md border border-gray-100">
                                                    {edu.logoUrl ? (
                                                        <img
                                                            src={edu.logoUrl}
                                                            alt={edu.school}
                                                            className="object-contain w-full h-full"
                                                        />
                                                    ) : (
                                                        <MdSchool className="text-2xl text-[#4169E1]" />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                {edu.grade && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#4169E1]"></span>
                                                        <span>Grade: <span className="text-gray-300">{edu.grade}</span></span>
                                                    </div>
                                                )}

                                                {edu.description && (
                                                    <div className="text-sm leading-relaxed text-gray-400 mt-4 space-y-2">
                                                        {edu.description.split('\n').map((line, i) => {
                                                            const trimmed = line.trim();
                                                            // Deteksi bullet points (dimulai dengan •, -, atau *)
                                                            const isBullet = /^[•\-*]/.test(trimmed);

                                                            if (isBullet) {
                                                                return (
                                                                    <div key={i} className="flex items-start gap-3 pl-2 group/item">
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#4169E1]/60 mt-2 shrink-0 group-hover/item:bg-[#4169E1] transition-colors"></span>
                                                                        <span className="flex-1">{trimmed.replace(/^[•\-*]\s*/, '')}</span>
                                                                    </div>
                                                                );
                                                            }

                                                            // Jika baris kosong, kasih sedikit spacing tapi jangan render p kosong
                                                            if (!trimmed) return <div key={i} className="h-2" />;

                                                            return <p key={i}>{line}</p>;
                                                        })}
                                                    </div>
                                                )}

                                                {edu.activities && (
                                                    <div className="pt-3 border-t border-white/5">
                                                        <p className="text-xs text-gray-500 line-clamp-2 italic">
                                                            Activities: {edu.activities}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </GlowCard>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
