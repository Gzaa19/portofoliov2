"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { GradientText } from "@/components/ui";

interface ProjectTag {
    id: string;
    name: string;
}

interface ProjectHeroProps {
    title: string;
    image?: string | null;
    tags: ProjectTag[];
    className?: string;
}

/**
 * ProjectHero - Hero section for project detail page
 * Shows project image with overlay and title
 */
export function ProjectHero({ title, image, tags, className }: ProjectHeroProps) {
    return (
        <div className={cn("relative rounded-3xl overflow-hidden mb-10 group", className)}>
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent z-10" />

            {/* Image or Placeholder */}
            {image ? (
                <Image
                    src={image}
                    alt={title}
                    width={1200}
                    height={600}
                    className="w-full h-[300px] md:h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
            ) : (
                <div className="w-full h-[300px] md:h-[450px] flex items-center justify-center bg-linear-to-br from-gray-800 to-gray-900">
                    <div className="text-center">
                        <span className="text-8xl mb-4 block opacity-50">🚀</span>
                        <span className="text-gray-500 text-lg">Project Preview</span>
                    </div>
                </div>
            )}

            {/* Title overlay on image */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20">
                <GradientText
                    colors={['#4285f4', '#9b72cb', '#d96570', '#9b72cb', '#4285f4']}
                    animationSpeed={6}
                    className="text-3xl md:text-5xl font-bold font-serif mb-4"
                >
                    {title}
                </GradientText>

                {/* Quick Tech Pills */}
                <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 5).map((tag) => (
                        <span
                            key={tag.id}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 backdrop-blur-md text-white/80 border border-white/20"
                        >
                            {tag.name}
                        </span>
                    ))}
                    {tags.length > 5 && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 backdrop-blur-md text-white/80 border border-white/20">
                            +{tags.length - 5} more
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
