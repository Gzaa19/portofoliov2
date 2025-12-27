"use client";

import { GlowCard } from "@/components/ui";
import { MdCategory } from "react-icons/md";
import { cn } from "@/lib/utils";

interface ProjectCategoryCardProps {
    category: {
        name: string;
        slug: string;
    } | null;
    className?: string;
}

/**
 * ProjectCategoryCard - Displays the project category
 */
export function ProjectCategoryCard({ category, className }: ProjectCategoryCardProps) {
    if (!category) return null;

    return (
        <GlowCard
            glowColor="primary"
            glowPosition="bottom-left"
            glowSize="sm"
            className={cn(className)}
        >
            <div className="p-6">
                <h3
                    className="text-lg font-semibold mb-4 flex items-center gap-2"
                    style={{ color: 'var(--theme-text-heading)' }}
                >
                    <MdCategory className="w-5 h-5 text-blue-600" />
                    Category
                </h3>
                <div className="flex items-center">
                    <span className="px-6 py-2 bg-blue-600 text-white font-medium rounded-full text-sm">
                        {category.name}
                    </span>
                </div>
            </div>
        </GlowCard>
    );
}
