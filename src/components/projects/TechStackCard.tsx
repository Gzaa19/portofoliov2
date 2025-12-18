"use client";

import { GlowCard } from "@/components/ui";
import { TechStackIcon } from "@/components/TechStackIcon";
import { CodeIcon } from "@/components/icons";

interface Tag {
    id: string;
    name: string;
    iconName?: string | null;
    color?: string | null;
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
            glowColor="primary"
            glowPosition="bottom-left"
            glowSize="sm"
            className={className}
        >
            <div className="p-6">
                <h3
                    className="text-lg font-semibold mb-4 flex items-center gap-2"
                    style={{ color: 'var(--theme-text-heading)' }}
                >
                    <CodeIcon className="w-5 h-5 text-blue-600" />
                    Tech Stack
                </h3>
                <div className="flex flex-wrap gap-3">
                    {tags.map((tag) => (
                        <TechStackIcon
                            key={tag.id}
                            name={tag.name}
                            iconName={tag.iconName || undefined}
                            iconColor={tag.color || undefined}
                            size="sm"
                            showLabel={false}
                            showBackground={false}
                        />
                    ))}
                </div>
            </div>
        </GlowCard>
    );
}
