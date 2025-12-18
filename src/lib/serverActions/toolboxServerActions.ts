"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface CategoryFormData {
    name: string;
    order?: number;
    isActive?: boolean;
}

export interface ItemFormData {
    name: string;
    iconName: string;
    color: string;
    order?: number;
    categoryId: string;
    isActive?: boolean;
}

// ============ CATEGORIES ============

export async function getToolboxCategoriesAction() {
    try {
        const categories = await prisma.toolboxCategory.findMany({
            where: { isActive: true },
            include: {
                items: {
                    where: { isActive: true },
                    orderBy: { order: "asc" },
                },
            },
            orderBy: { order: "asc" },
        });
        return { success: true, data: categories };
    } catch (error) {
        console.error("Failed to fetch toolbox:", error);
        return { success: false, error: "Failed to fetch toolbox" };
    }
}

export async function createCategoryAction(formData: CategoryFormData) {
    try {
        const { name, order } = formData;

        const category = await prisma.toolboxCategory.create({
            data: {
                name,
                order: order || 0,
            },
        });

        // Revalidate toolbox page
        revalidatePath("/");
        revalidatePath("/toolbox");

        return { success: true, data: category };
    } catch (error) {
        console.error("Failed to create category:", error);
        return { success: false, error: "Failed to create category" };
    }
}

export async function updateCategoryAction(id: string, formData: CategoryFormData) {
    try {
        const category = await prisma.toolboxCategory.update({
            where: { id },
            data: formData,
        });

        // Revalidate toolbox page
        revalidatePath("/");
        revalidatePath("/toolbox");

        return { success: true, data: category };
    } catch (error) {
        console.error("Failed to update category:", error);
        return { success: false, error: "Failed to update category" };
    }
}

export async function deleteCategoryAction(id: string) {
    try {
        await prisma.toolboxCategory.delete({ where: { id } });

        // Revalidate toolbox page
        revalidatePath("/");
        revalidatePath("/toolbox");

        return { success: true, message: "Category deleted successfully" };
    } catch (error) {
        console.error("Failed to delete category:", error);
        return { success: false, error: "Failed to delete category" };
    }
}

// ============ ITEMS ============

export async function createItemAction(formData: ItemFormData) {
    try {
        const { name, iconName, color, order, categoryId } = formData;

        const item = await prisma.toolboxItem.create({
            data: {
                name,
                iconName,
                color,
                order: order || 0,
                categoryId,
            },
        });

        // Revalidate toolbox page
        revalidatePath("/");
        revalidatePath("/toolbox");

        return { success: true, data: item };
    } catch (error) {
        console.error("Failed to create item:", error);
        return { success: false, error: "Failed to create item" };
    }
}

export async function updateItemAction(id: string, formData: ItemFormData) {
    try {
        const item = await prisma.toolboxItem.update({
            where: { id },
            data: formData,
        });

        // Revalidate toolbox page
        revalidatePath("/");
        revalidatePath("/toolbox");

        return { success: true, data: item };
    } catch (error) {
        console.error("Failed to update item:", error);
        return { success: false, error: "Failed to update item" };
    }
}

export async function deleteItemAction(id: string) {
    try {
        await prisma.toolboxItem.delete({ where: { id } });

        // Revalidate toolbox page
        revalidatePath("/");
        revalidatePath("/toolbox");

        return { success: true, message: "Item deleted successfully" };
    } catch (error) {
        console.error("Failed to delete item:", error);
        return { success: false, error: "Failed to delete item" };
    }
}
