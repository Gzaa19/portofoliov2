"use client";

import { GlowCard } from "@/components/ui";
import { DocumentIcon } from "@/components/icons";

interface ProjectDescriptionProps {
    description: string;
    className?: string;
}

/**
 * ProjectDescription - Card showing project description
 */
export function ProjectDescription({ description, className }: ProjectDescriptionProps) {
    return (
        <GlowCard
            glowColor="primary"
            glowPosition="top-right"
            className={className}
        >
            <div className="p-6 md:p-8">
                <h2
                    className="text-xl font-semibold mb-4 flex items-center gap-2"
                    style={{ color: 'var(--theme-text-heading)' }}
                >
                    <DocumentIcon className="w-5 h-5 text-blue-600" />
                    About This Project
                </h2>
                <p
                    className="leading-relaxed text-base md:text-lg"
                    style={{ color: 'var(--theme-text-body)' }}
                >
                    {description}
                </p>
            </div>
        </GlowCard>
    );
}
