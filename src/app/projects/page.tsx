import ProjectCard from "@/components/ProjectCard";
import prisma from "@/lib/prisma";
import AntigravityWrapper from "@/components/AntigravityWrapper";

export const revalidate = 3600;
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
        <div className="min-h-screen py-32 px-4 relative">
            {/* Antigravity Particles */}
            <AntigravityWrapper
                count={800}
                magnetRadius={18}
                ringRadius={12}
                waveSpeed={0.3}
                waveAmplitude={1.2}
                particleSize={0.8}
                lerpSpeed={0.08}
                color={'#4285F4'}
                autoAnimate={true}
                particleVariance={2}
            />

            <div className="container mx-auto max-w-6xl relative z-10 pointer-events-none">
                {/* Header Section */}
                <div className="text-center mb-16 pointer-events-auto">
                    <h1 className="section-title mb-6">
                        My Projects
                    </h1>

                    <p className="mt-4 text-center text-gray-500 md:text-lg font-sans max-w-2xl mx-auto leading-relaxed">
                        A collection of projects I've worked on, showcasing my skills in web development, design, and problem-solving.
                    </p>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pointer-events-auto">
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
                    <div className="text-center text-gray-400 py-16">
                        <p>Belum ada project yang ditambahkan.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
