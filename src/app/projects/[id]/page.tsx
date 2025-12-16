import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { TechStackIcon } from "@/components/TechStackIcon";


export const revalidate = 0;

interface Props {
    params: Promise<{
        id: string;
    }>;
}

// Fetch project from database
async function getProject(slug: string) {
    const project = await prisma.project.findUnique({
        where: { slug },
        include: {
            tags: {
                include: {
                    tag: true,
                },
            },
        },
    });

    if (!project) return null;

    return {
        ...project,
        tags: project.tags.map((pt) => pt.tag),
    };
}

export default async function ProjectDetailPage({ params }: Props) {
    const { id } = await params;
    const project = await getProject(id);

    if (!project) {
        return notFound();
    }

    return (
        <div className="min-h-screen py-24 md:py-32 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Back Button */}
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-500 mb-8 transition-colors group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to Projects
                </Link>

                {/* Main Content - 2 Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left - Project Image */}
                    <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                        {project.image ? (
                            <Image
                                src={project.image}
                                alt={project.title}
                                width={800}
                                height={600}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                <div className="text-center">
                                    <span className="text-6xl mb-4 block">📦</span>
                                    <span className="text-gray-400 text-sm">No Preview Available</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right - Project Details */}
                    <div className="space-y-6">
                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900">
                            {project.title}
                        </h1>

                        {/* Tech Stack Section */}
                        <div className="py-4 border-y border-gray-200">
                            <h3 className="text-sm font-medium text-gray-400 mb-3">Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <TechStackIcon key={tag.id} name={tag.name} size="sm" showLabel={false} />
                                ))}
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="py-4 border-b border-gray-200">
                            <h3 className="text-sm font-medium text-gray-400 mb-3">Description</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {project.description}
                            </p>
                        </div>

                        {/* Links Section */}
                        <div className="pt-4">
                            <h3 className="text-sm font-medium text-gray-400 mb-4">Project Links</h3>
                            <div className="flex flex-wrap gap-3">
                                {project.link && (
                                    <Link
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Live Demo
                                    </Link>
                                )}
                                {project.github && (
                                    <Link
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        GitHub
                                    </Link>
                                )}
                                {!project.link && !project.github && (
                                    <p className="text-gray-400 text-sm">No external links available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
