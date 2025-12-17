import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { TechStackIcon } from "@/components/TechStackIcon";
import AntigravityWrapper from "@/components/AntigravityWrapper";
import GradientText from "@/components/GradientText";


export const revalidate = 3600;

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
        <div className="min-h-screen py-24 md:py-32 px-4 relative">
            {/* Antigravity Particles Background */}
            <AntigravityWrapper
                count={600}
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

            <div className="container mx-auto max-w-6xl relative z-10">
                {/* Back Button */}
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-all duration-300 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    <span className="font-medium">Back to Projects</span>
                </Link>

                {/* Hero Section - Project Image Full Width */}
                <div className="relative rounded-3xl overflow-hidden mb-10 group">
                    {/* Glassmorphism overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

                    {project.image ? (
                        <Image
                            src={project.image}
                            alt={project.title}
                            width={1200}
                            height={600}
                            className="w-full h-[300px] md:h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-[300px] md:h-[450px] flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                            <div className="text-center">
                                <span className="text-8xl mb-4 block opacity-50">🚀</span>
                                <span className="text-gray-500 text-lg">Project Preview</span>
                            </div>
                        </div>
                    )}

                    {/* Title overlay on image */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20">
                        <GradientText
                            colors={['#4285f4', '#9b72cb', '#d96570', '#9b72cb', '#4285f4']}
                            animationSpeed={6}
                            className="text-3xl md:text-5xl font-bold font-serif mb-4"
                        >
                            {project.title}
                        </GradientText>

                        {/* Quick Tech Pills */}
                        <div className="flex flex-wrap gap-2">
                            {project.tags.slice(0, 5).map((tag) => (
                                <span
                                    key={tag.id}
                                    className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 backdrop-blur-md text-white/80 border border-white/20"
                                >
                                    {tag.name}
                                </span>
                            ))}
                            {project.tags.length > 5 && (
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 backdrop-blur-md text-white/80 border border-white/20">
                                    +{project.tags.length - 5} more
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Content - Description */}
                    <div className="lg:col-span-2 bg-black rounded-3xl border border-gray-800 p-6 md:p-8 relative overflow-hidden">
                        {/* Subtle glow effect */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                About This Project
                            </h2>
                            <p className="text-gray-400 leading-relaxed text-base md:text-lg">
                                {project.description}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar - Tech Stack & Links */}
                    <div className="space-y-6">

                        {/* Tech Stack Card */}
                        <div className="bg-black rounded-3xl border border-gray-800 p-6 relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2" />

                            <div className="relative z-10">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                    Tech Stack
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {project.tags.map((tag) => (
                                        <div
                                            key={tag.id}
                                            className="p-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
                                        >
                                            <TechStackIcon name={tag.name} size="sm" showLabel={false} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Links Card */}
                        <div className="bg-black rounded-3xl border border-gray-800 p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

                            <div className="relative z-10">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                    Project Links
                                </h3>
                                <div className="flex flex-col gap-3">
                                    {project.link && (
                                        <Link
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl bg-white text-black hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                                            className="inline-flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                            </svg>
                                            View on GitHub
                                        </Link>
                                    )}
                                    {!project.link && !project.github && (
                                        <p className="text-gray-500 text-sm text-center py-4">No external links available.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

