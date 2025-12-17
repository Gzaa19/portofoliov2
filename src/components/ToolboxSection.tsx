"use client";

import * as SiIcons from "react-icons/si";
import { IconType } from "react-icons";
import { cn } from "@/lib/utils";
import { SectionCard } from "@/components/SectionCard";
import { GeminiStarIcon } from "@/components/GeminiStarIcon";
import type { ToolboxItem, ToolboxCategory } from "@/types/types";

interface ToolboxSectionProps {
    categories?: ToolboxCategory[];
}

/**
 * ToolboxSection - Displays tech stack organized by categories
 */
export function ToolboxSection({ categories = [] }: ToolboxSectionProps) {
    const getIcon = (iconName: string): IconType | null => {
        const icons = SiIcons as Record<string, IconType>;
        return icons[iconName] || null;
    };

    if (categories.length === 0) {
        return null;
    }

    return (
        <section id="tech-stack" className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
                <SectionCard className="p-8 md:p-12">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <GeminiStarIcon size={40} />
                        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                            My Toolbox
                        </h2>
                    </div>

                    <p className="text-gray-400 text-sm md:text-base mb-10 max-w-xl">
                        Explore the technologies and tools I use to craft exceptional digital experiences.
                    </p>

                    {/* Categories */}
                    <div className="space-y-10">
                        {categories.map((category, categoryIndex) => (
                            <div key={category.id}>
                                <h3
                                    className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wider mb-6 animate-fade-in-up"
                                    style={{ animationDelay: `${categoryIndex * 0.1}s` }}
                                >
                                    {category.name}
                                </h3>

                                <div className="grid grid-cols-4 gap-2 md:flex md:flex-wrap md:gap-4">
                                    {category.items.map((item, index) => {
                                        const IconComp = getIcon(item.iconName);
                                        return (
                                            <div
                                                key={item.id}
                                                className={cn(
                                                    "flex flex-col items-center justify-center",
                                                    "aspect-square w-full md:w-28 md:h-28 md:aspect-auto",
                                                    // Glassmorphism effect
                                                    "rounded-2xl bg-white/10 backdrop-blur-md",
                                                    "border border-white/20",
                                                    "hover:bg-white/20 hover:border-white/40",
                                                    "transition-all duration-300",
                                                    "cursor-pointer group p-2 md:p-0",
                                                    "hover:scale-[1.08] hover:-translate-y-1 animate-scale-in",
                                                    "shadow-lg shadow-black/10"
                                                )}
                                                style={{
                                                    animationDelay: `${index * 0.08 + categoryIndex * 0.15}s`,
                                                    animationFillMode: 'backwards'
                                                }}
                                            >
                                                <div
                                                    className="animate-float"
                                                    style={{ animationDelay: `${index * 0.12}s` }}
                                                >
                                                    {IconComp ? (
                                                        <IconComp
                                                            className="w-8 h-8 md:w-12 md:h-12 mb-2 transition-transform group-hover:scale-110"
                                                            style={{ color: item.color }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="w-8 h-8 md:w-12 md:h-12 mb-2 rounded-lg flex items-center justify-center text-2xl"
                                                            style={{ backgroundColor: item.color + '20', color: item.color }}
                                                        >
                                                            ?
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-white/80 text-[10px] md:text-sm font-medium text-center group-hover:text-white transition-colors truncate w-full px-1">
                                                    {item.name}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </div>
        </section>
    );
}

export default ToolboxSection;
