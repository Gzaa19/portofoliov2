import prisma from "@/lib/prisma";
import { ProjectsManager } from "@/components/admin";

async function getProjects() {
    const projects = await prisma.project.findMany({
        include: {
            tags: {
                include: {
                    tag: true,
                },
            },
            category: true,
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
        categoryId: project.categoryId,
        category: project.category ? {
            id: project.category.id,
            name: project.category.name,
            slug: project.category.slug,
            description: project.category.description,
            color: project.category.color,
            iconName: project.category.iconName,
        } : null,
        tags: project.tags.map((pt) => ({
            id: pt.tag.id,
            name: pt.tag.name,
            slug: pt.tag.slug,
            color: pt.tag.color ?? undefined,
        })),
    }));
}

async function getCategories() {
    return prisma.projectCategory.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
    });
}

export default async function AdminProjectsPage() {
    const projects = await getProjects();
    const categories = await getCategories();

    return <ProjectsManager initialProjects={projects} categories={categories} />;
}
