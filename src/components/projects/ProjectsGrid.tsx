"use client";

import { cn } from "@/lib/utils";
import { ProjectCard } from "@/components/ProjectCard";

interface Project {
    id: string;
    slug: string;
    title: string;
    description: string;
    image?: string | null;
    link?: string | null;
    github?: string | null;
}

interface ProjectsGridProps {
    projects: Project[];
    className?: string;
}

/**
 * ProjectsGrid - Grid layout for displaying project cards
 */
export function ProjectsGrid({ projects, className }: ProjectsGridProps) {
    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8",
                className
            )}
        >
            {projects.map((project) => (
                <div key={project.id} className="h-full">
                    <ProjectCard
                        title={project.title}
                        description={project.description}
                        image={project.image ?? undefined}
                        link={project.link ?? undefined}
                        github={project.github ?? undefined}
                        detailLink={`/projects/${project.slug}`}
                    />
                </div>
            ))}
        </div>
    );
}
