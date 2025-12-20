"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface FolderProjectCardProps {
    title: string;
    slug: string;
    image?: string;
    className?: string;
}

/**
 * Mini Project Card for Folder component - shows image + title, navigates on click
 * Uses CSS variables for theme-aware styling (Glassmorphism in Dark Mode)
 */
export function FolderProjectCard({
    title,
    slug,
    image,
    className,
}: FolderProjectCardProps) {
    const router = useRouter();

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent folder toggle
        router.push(`/projects/${slug}`);
    };

    return (
        <div
            onClick={handleClick}
            className={cn(
                "w-full h-full rounded-xl overflow-hidden cursor-pointer",
                "shadow-sm border",
                "hover:shadow-xl hover:scale-105 transition-all duration-300",
                "flex flex-col group relative",
                // Dark mode specific styles for glass glow
                "dark:hover:shadow-[var(--theme-glow-shadow)]",
                // Glass effect base
                "backdrop-blur-md",
                className
            )}
            style={{
                // Uses the same variable as ProjectCard for consistent glass look
                background: 'var(--theme-card-bg)',
                borderColor: 'var(--theme-card-border)'
            }}
        >
            {/* Shimmer Effect on Hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent z-20 pointer-events-none" />

            {/* Project Image */}
            <div
                className="relative flex-1 overflow-hidden"
            >
                {/* Subtle gradient overlay on image */}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent z-10" />

                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center opacity-50"
                        style={{
                            background: 'var(--theme-bg-secondary)'
                        }}
                    >
                        <span className="text-3xl">🚀</span>
                    </div>
                )}
            </div>

            {/* Title Area */}
            <div
                className="p-1 border-t relative z-10"
                style={{
                    borderColor: 'var(--theme-card-border)'
                }}
            >
                <h4
                    className="text-[6px] md:text-[7px] font-serif font-bold text-center leading-tight line-clamp-2"
                    style={{ color: 'var(--theme-text-heading)' }}
                >
                    {title}
                </h4>
            </div>
        </div>
    );
}

export default FolderProjectCard;
