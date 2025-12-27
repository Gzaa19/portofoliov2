/**
 * Data Access Layer (DAL) for Project Categories
 * 
 * This file contains functions that directly access the database
 * for category-related data. Use these in Server Components.
 */

import prisma from "@/lib/prisma";

export interface ProjectCategoryData {
    id: string;
    name: string;
    slug: string;
    projectCount?: number;
}

/**
 * Fetch all project categories from the database
 * Ordered by order (asc) then name (asc)
 */
export async function getAllCategories(): Promise<ProjectCategoryData[]> {
    try {
        const categories = await prisma.projectCategory.findMany({
            where: {
                isActive: true,
            },
            include: {
                _count: {
                    select: { projects: true },
                },
            },
            orderBy: [
                { order: 'asc' },
                { name: 'asc' },
            ],
        });

        return categories.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            projectCount: category._count.projects,
        }));
    } catch (error) {
        console.error("Error fetching project categories:", error);
        return [];
    }
}
