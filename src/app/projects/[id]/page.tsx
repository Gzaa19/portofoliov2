import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/data";
import { PageLayout, BackButton } from "@/components/ui";
import {
    ProjectHero,
    ProjectDescription,
    TechStackCard,
    ProjectLinksCard,
} from "@/components/projects";

export const revalidate = 3600;

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProjectDetailPage({ params }: Props) {
    const { id } = await params;
    const project = await getProjectBySlug(id);

    if (!project) {
        return notFound();
    }

    return (
        <PageLayout
            particleCount={600}
            className="py-24 md:py-32"
            containerClassName="pointer-events-auto"
        >
            {/* Back Button */}
            <BackButton href="/projects" label="Back to Projects" className="mb-8" />

            {/* Hero Section */}
            <ProjectHero
                title={project.title}
                image={project.image}
                tags={project.tags}
            />

            {/* Content Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Description */}
                <ProjectDescription
                    description={project.description}
                    className="lg:col-span-2"
                />

                {/* Sidebar - Tech Stack & Links */}
                <div className="space-y-6">
                    <TechStackCard tags={project.tags} />
                    <ProjectLinksCard
                        demoUrl={project.link}
                        githubUrl={project.github}
                    />
                </div>
            </div>
        </PageLayout>
    );
}
