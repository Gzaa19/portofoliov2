import prisma from "@/lib/prisma";
import { ProjectsManager } from "@/components/admin";

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

async function getProjects() {
    const projects = await prisma.project.findMany({
        include: {
            tags: {
                include: {
                    tag: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    return projects.map((project) => ({
        id: project.id,
        slug: project.slug,
        title: project.title,
        description: project.description,
        image: project.image ?? undefined,
        link: project.link ?? undefined,
        github: project.github ?? undefined,
        featured: project.featured,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        tags: project.tags.map((pt) => ({
            id: pt.tag.id,
            name: pt.tag.name,
            slug: pt.tag.slug,
            color: pt.tag.color ?? undefined,
        })),
    }));
}

export default async function AdminProjectsPage() {
    const projects = await getProjects();

    return <ProjectsManager initialProjects={projects} />;
}
