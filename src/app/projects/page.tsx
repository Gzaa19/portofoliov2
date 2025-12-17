import { PageLayout, PageHeader, EmptyState } from "@/components/ui";
import { ProjectsGrid } from "@/components/projects";
import { getAllProjects } from "@/data";

export const revalidate = 3600;

export default async function ProjectsPage() {
    const projects = await getAllProjects();

    return (
        <PageLayout particleCount={800}>
            {/* Header Section */}
            <div className="pointer-events-auto">
                <PageHeader
                    title="My Projects"
                    description="A collection of projects I've worked on, showcasing my skills in web development, design, and problem-solving."
                />
            </div>

            {/* Projects Grid */}
            {projects.length > 0 ? (
                <ProjectsGrid projects={projects} className="pointer-events-auto" />
            ) : (
                <EmptyState
                    message="Belum ada project yang ditambahkan."
                    className="pointer-events-auto"
                />
            )}
        </PageLayout>
    );
}
