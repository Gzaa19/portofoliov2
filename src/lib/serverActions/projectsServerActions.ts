"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface ProjectFormData {
    slug: string;
    title: string;
    description: string;
    link?: string;
    github?: string;
    image?: string;
    featured?: boolean;
    tags?: string[];
}

export async function getAllProjectsAction() {
    try {
        const projects = await prisma.project.findMany({
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        const transformedProjects = projects.map((project) => ({
            ...project,
            tags: project.tags.map((pt) => pt.tag),
        }));

        return { success: true, data: transformedProjects };
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return { success: false, error: "Failed to fetch projects" };
    }
}

export async function createProjectAction(formData: ProjectFormData) {
    try {
        const { slug, title, description, link, github, image, featured, tags } = formData;

        if (!slug || !title || !description) {
            return { success: false, error: "slug, title, and description are required" };
        }

        const project = await prisma.project.create({
            data: {
                slug,
                title,
                description,
                link,
                github,
                image,
                featured: featured ?? false,
                tags: tags
                    ? {
                        create: tags.map((tagName: string) => ({
                            tag: {
                                connectOrCreate: {
                                    where: { name: tagName },
                                    create: {
                                        name: tagName,
                                        slug: tagName
                                            .toLowerCase()
                                            .replace(/[^a-z0-9]+/g, "-")
                                            .replace(/(^-|-$)/g, ""),
                                    },
                                },
                            },
                        })),
                    }
                    : undefined,
            },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        const transformedProject = {
            ...project,
            tags: project.tags.map((pt) => pt.tag),
        };

        // Revalidate all pages that display projects
        revalidatePath("/");
        revalidatePath("/projects");
        revalidatePath("/projects/[slug]", "page");

        return { success: true, data: transformedProject };
    } catch (error) {
        console.error("Failed to create project:", error);
        return { success: false, error: "Failed to create project" };
    }
}

export async function updateProjectAction(slug: string, formData: ProjectFormData & { newSlug?: string }) {
    try {
        const { title, description, link, github, image, featured, tags, newSlug } = formData;

        const existingProject = await prisma.project.findUnique({
            where: { slug },
        });

        if (!existingProject) {
            return { success: false, error: "Project not found" };
        }

        // If tags are being updated, delete existing and create new
        if (tags) {
            await prisma.projectTag.deleteMany({
                where: { projectId: existingProject.id },
            });
        }

        const project = await prisma.project.update({
            where: { slug },
            data: {
                slug: newSlug ?? slug,
                title,
                description,
                link,
                github,
                image,
                featured,
                tags: tags
                    ? {
                        create: tags.map((tagName: string) => ({
                            tag: {
                                connectOrCreate: {
                                    where: { name: tagName },
                                    create: {
                                        name: tagName,
                                        slug: tagName
                                            .toLowerCase()
                                            .replace(/[^a-z0-9]+/g, "-")
                                            .replace(/(^-|-$)/g, ""),
                                    },
                                },
                            },
                        })),
                    }
                    : undefined,
            },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        const transformedProject = {
            ...project,
            tags: project.tags.map((pt) => pt.tag),
        };

        // Revalidate all pages that display projects
        revalidatePath("/");
        revalidatePath("/projects");
        revalidatePath(`/projects/${project.slug}`);

        return { success: true, data: transformedProject };
    } catch (error) {
        console.error("Failed to update project:", error);
        return { success: false, error: "Failed to update project" };
    }
}

export async function deleteProjectAction(slug: string) {
    try {
        const project = await prisma.project.findUnique({
            where: { slug },
        });

        if (!project) {
            return { success: false, error: "Project not found" };
        }

        await prisma.project.delete({
            where: { slug },
        });

        // Revalidate all pages that display projects
        revalidatePath("/");
        revalidatePath("/projects");

        return { success: true, message: "Project deleted successfully" };
    } catch (error) {
        console.error("Failed to delete project:", error);
        return { success: false, error: "Failed to delete project" };
    }
}
