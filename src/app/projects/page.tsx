import { PageLayout, PageHeader, EmptyState } from "@/components/ui";
import { ProjectsFilter } from "@/components/projects";
import { getAllProjects, getAllCategories } from "@/data";

export const revalidate = 60;

export default async function ProjectsPage() {
    const projects = await getAllProjects();
    const categories = await getAllCategories();

    return (
        <PageLayout showParticles={false}>
            {/* Header Section */}
            <div className="pointer-events-auto">
                <PageHeader
                    title="My Projects"
                    description="A collection of projects I've worked on, showcasing my skills in web development, design, and problem-solving."
                />
            </div>

            {/* Projects Filter & Grid */}
            {projects.length > 0 ? (
                <ProjectsFilter projects={projects} categories={categories} />
            ) : (
                <EmptyState
                    message="Belum ada project yang ditambahkan."
                    className="pointer-events-auto"
                />
            )}
        </PageLayout>
    );
}
