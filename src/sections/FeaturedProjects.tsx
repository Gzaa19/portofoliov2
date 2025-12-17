"use client";

import Folder from "@/components/Folder";
import { FolderProjectCard } from "@/components/FolderProjectCard";
import GradientText from "@/components/GradientText";

interface Project {
    id: string;
    slug: string;
    title: string;
    description: string;
    image: string | null;
    link: string | null;
    github: string | null;
}

interface FeaturedProjectsProps {
    projects: Project[];
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
        <section className="py-20 lg:py-28 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-8">
                    <GradientText
                        colors={['#4285f4', '#9b72cb', '#d96570', '#9b72cb', '#4285f4']}
                        animationSpeed={6}
                        className="section-title"
                    >
                        Featured Projects
                    </GradientText>
                    <p className="mt-4 text-gray-500 md:text-lg font-sans max-w-md mx-auto">
                        Click the folder to explore my recent work
                    </p>
                </div>

                {/* Folder with Projects - with proper spacing */}
                <div className="flex justify-center items-center min-h-[250px] mt-6">
                    <Folder
                        color="#4285F4"
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
