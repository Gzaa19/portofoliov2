/**
 * Data Access Layer (DAL) for Toolbox
 * 
 * This file contains functions that directly access the database
 * for toolbox-related data. Use these in Server Components.
 */

import { prisma } from "@/lib/prisma";
import type { ToolboxCategory, ToolboxItem } from "@/types/types";

/**
 * Fetch all active toolbox categories with their items
 */
export async function getToolboxCategories(): Promise<ToolboxCategory[]> {
    try {
        const categories = await prisma.toolboxCategory.findMany({
            where: { isActive: true },
            include: {
                items: {
                    where: { isActive: true },
                    orderBy: { order: 'asc' },
                },
            },
            orderBy: { order: 'asc' },
        });

        // Map to ensure type compatibility
        return categories.map((category) => ({
            id: category.id,
            name: category.name,
            order: category.order,
            isActive: category.isActive,
            items: category.items.map((item) => ({
                id: item.id,
                name: item.name,
                iconName: item.iconName,
                color: item.color ?? '#888888', // Default color if null
                order: item.order,
                isActive: item.isActive,
                categoryId: item.categoryId,
            })),
        }));
    } catch (error) {
        console.error("Error fetching toolbox categories:", error);
        return [];
    }
}

// Re-export types for convenience
export type { ToolboxCategory, ToolboxItem };
