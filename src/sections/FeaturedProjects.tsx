"use client";

import Folder from "@/components/Folder";
import { FolderProjectCard } from "@/components/FolderProjectCard";
import { GradientText } from "@/components/ui";
import { GRADIENT_PRESETS, THEME_COLORS } from "@/lib/theme";
import type { FeaturedProject } from "@/data";

interface FeaturedProjectsProps {
    projects: FeaturedProject[];
}

/**
 * Featured Projects Section - Displays projects in an interactive Folder
 */
export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
    if (projects.length === 0) {
        return null;
    }

    // Create folder items based on number of projects (show only as many as we have)
    const projectCount = Math.min(projects.length, 3);
    const folderItems = projects.slice(0, projectCount).map((project) => (
        <FolderProjectCard
            key={project.id}
            title={project.title}
            slug={project.slug}
            image={project.image ?? undefined}
        />
    ));

    return (
        <section
            className="py-20 lg:py-28"
            style={{ backgroundColor: 'var(--theme-bg)' }}
        >
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-8">
                    <GradientText
                        colors={GRADIENT_PRESETS.cleanSaas}
                        animationSpeed={6}
                        className="section-title"
                    >
                        Featured Projects
                    </GradientText>
                    <p
                        className="mt-4 md:text-lg font-sans max-w-md mx-auto"
                        style={{ color: 'var(--theme-text-body)' }}
                    >
                        Click the folder to explore my recent work
                    </p>
                </div>

                {/* Folder with Projects - with proper spacing */}
                <div className="flex justify-center items-center min-h-[250px] mt-6">
                    <Folder
                        color={THEME_COLORS.primaryHex}
                        size={1.8}
                        items={folderItems}
                        className="cursor-pointer"
                    />
                </div>
            </div>
        </section>
    );
}

export default FeaturedProjects;
