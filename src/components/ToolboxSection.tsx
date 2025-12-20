"use client";

import * as SiIcons from "react-icons/si";
import { IconType } from "react-icons";
import { cn } from "@/lib/utils";
import { GlowCard } from "@/components/ui";
import { GeminiStarIcon } from "@/components/GeminiStarIcon";
import { THEME_COLORS } from "@/lib/theme";
import type { ToolboxCategory } from "@/types/types";

interface ToolboxSectionProps {
    categories?: ToolboxCategory[];
}

/**
 * ToolboxSection - Displays tech stack organized by categories
 * Header outside, each category has its own GlowCard container
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
                {/* Header - Outside container */}
                <div className="flex items-center gap-3 mb-4">
                    <GeminiStarIcon size={40} color={THEME_COLORS.primaryHex} />
                    <h2
                        className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold"
                        style={{ color: 'var(--theme-text-heading)' }}
                    >
                        My Toolbox
                    </h2>
                </div>

                <p
                    className="text-sm md:text-base mb-10 max-w-xl"
                    style={{ color: 'var(--theme-text-body)' }}
                >
                    Explore the technologies and tools I use to craft exceptional digital experiences.
                </p>

                {/* Categories - Each with its own GlowCard container */}
                <div className="space-y-8">
                    {categories.map((category, categoryIndex) => (
                        <GlowCard
                            key={category.id}
                            glowColor="primary"
                            glowPosition="top-right"
                            className="p-6 md:p-8"
                        >
                            <h3
                                className="text-xs md:text-sm font-medium uppercase tracking-wider mb-6 animate-fade-in-up"
                                style={{
                                    animationDelay: `${categoryIndex * 0.1}s`,
                                    color: 'var(--theme-text-muted)'
                                }}
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
                                                // Invisible/transparent card
                                                "rounded-2xl",
                                                "transition-all duration-300",
                                                "cursor-pointer group p-2 md:p-0",
                                                "hover:scale-[1.08] hover:-translate-y-1 animate-scale-in"
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
                                            <span
                                                className="text-[10px] md:text-sm font-medium text-center transition-colors truncate w-full px-1"
                                                style={{ color: 'var(--theme-text-heading)' }}
                                            >
                                                {item.name}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </GlowCard>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ToolboxSection;

