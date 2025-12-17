"use client";

import { GlowCard } from "@/components/ui";
import { TechStackIcon } from "@/components/TechStackIcon";
import { CodeIcon } from "@/components/icons";

interface Tag {
    id: string;
    name: string;
}

interface TechStackCardProps {
    tags: Tag[];
    className?: string;
}

/**
 * TechStackCard - Card showing project tech stack with icons
 */
export function TechStackCard({ tags, className }: TechStackCardProps) {
    return (
        <GlowCard
            glowColor="purple"
            glowPosition="bottom-left"
            glowSize="sm"
            className={className}
        >
            <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <CodeIcon className="w-5 h-5 text-purple-400" />
                    Tech Stack
                </h3>
                <div className="flex flex-wrap gap-3">
                    {tags.map((tag) => (
                        <div
                            key={tag.id}
                            className="p-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
                        >
                            <TechStackIcon name={tag.name} size="sm" showLabel={false} />
                        </div>
                    ))}
                </div>
            </div>
        </GlowCard>
    );
}
