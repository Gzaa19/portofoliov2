"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

interface ProjectCardProps {
    title: string;
    description: string;
    image?: string | StaticImageData;
    link?: string;
    github?: string;
    detailLink?: string;
    className?: string;
}

/**
 * Project Card - Displays project information with hover effects
 */
export function ProjectCard({
    title,
    description,
    image,
    link,
    github,
    detailLink,
    className,
}: ProjectCardProps) {
    return (
        <div
            className={cn(
                "group relative h-full flex flex-col rounded-3xl bg-black border border-gray-800 overflow-hidden shadow-lg cq-container",
                "hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up",
                className
            )}
        >
            {/* Animated Border on Hover */}
            <div className="absolute inset-0 rounded-3xl border border-gray-800 group-hover:border-blue-400/50 transition-colors duration-500" />

            {/* Project Image */}
            {image && (
                <div className="relative h-48 md:h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </div>
            )}

            {/* Placeholder for projects without image */}
            {!image && (
                <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-6xl opacity-30 animate-float">🚀</div>
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 p-6 grow flex flex-col">
                <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-4 line-clamp-3 grow">
                    {description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2 mt-auto">
                    {detailLink && (
                        <Button size="sm" className="bg-white text-black hover:bg-gray-200" asChild>
                            <Link href={detailLink}>
                                View Project
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-4 h-4 ml-1"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Shimmer Effect on Hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
    );
}

export default ProjectCard;
