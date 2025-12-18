/**
 * Data Access Layer (DAL) for Projects
 * 
 * This file contains functions that directly access the database
 * for project-related data. Use these in Server Components.
 */

import prisma from "@/lib/prisma";

export interface FeaturedProject {
    id: string;
    slug: string;
    title: string;
    description: string;
    image: string | null;
    link: string | null;
    github: string | null;
}

export interface ProjectTag {
    id: string;
    name: string;
    iconName: string | null;
    color: string | null;
}

export interface ProjectWithTags {
    id: string;
    slug: string;
    title: string;
    description: string;
    image: string | null;
    link: string | null;
    github: string | null;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
    tags: ProjectTag[];
}

/**
 * Fetch featured projects from the database
 * Limited to 6 most recent featured projects
 */
export async function getFeaturedProjects(): Promise<FeaturedProject[]> {
    try {
        const projects = await prisma.project.findMany({
            where: {
                featured: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 6,
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        return projects.map((project) => ({
            id: project.id,
            slug: project.slug,
            title: project.title,
            description: project.description,
            image: project.image,
            link: project.link,
            github: project.github,
        }));
    } catch (error) {
        console.error("Error fetching featured projects:", error);
        return [];
    }
}

/**
 * Fetch all projects with their tags from the database
 */
export async function getAllProjects(): Promise<ProjectWithTags[]> {
    try {
        const projects = await prisma.project.findMany({
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return projects.map((project) => ({
            id: project.id,
            slug: project.slug,
            title: project.title,
            description: project.description,
            image: project.image,
            link: project.link,
            github: project.github,
            featured: project.featured,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            tags: project.tags.map((pt) => pt.tag),
        }));
    } catch (error) {
        console.error("Error fetching all projects:", error);
        return [];
    }
}

/**
 * Fetch a single project by slug
 */
export async function getProjectBySlug(slug: string): Promise<ProjectWithTags | null> {
    try {
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
            id: project.id,
            slug: project.slug,
            title: project.title,
            description: project.description,
            image: project.image,
            link: project.link,
            github: project.github,
            featured: project.featured,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            tags: project.tags.map((pt) => pt.tag),
        };
    } catch (error) {
        console.error("Error fetching project by slug:", error);
        return null;
    }
}
