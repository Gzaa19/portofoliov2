import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import prisma from "@/lib/prisma";

// Fetch projects from database
async function getProjects() {
    const projects = await prisma.project.findMany({
        include: {
            tags: {
                include: {
                    tag: true,
                },
            },
        },
    });

    return projects.map((project) => ({
        ...project,
        tags: project.tags.map((pt) => pt.tag),
    }));
}

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <div className="min-h-screen py-32 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="uppercase text-lg md:text-xl lg:text-2xl font-semibold tracking-[0.2em] bg-gradient-to-r from-emerald-500 to-teal-300 bg-clip-text text-transparent mb-6">
                        My Projects
                    </h1>

                    <p className="mt-4 text-center text-white/60 md:text-lg font-sans max-w-2xl mx-auto leading-relaxed">
                        A collection of projects I've worked on, showcasing my skills in web development, design, and problem-solving.
                    </p>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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

                {projects.length === 0 && (
                    <div className="text-center text-white/50 py-16">
                        <p>Belum ada project yang ditambahkan.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
