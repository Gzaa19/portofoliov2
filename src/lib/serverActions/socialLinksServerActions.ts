"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface SocialLinkFormData {
    name: string;
    username: string;
    description?: string;
    url: string;
    iconName: string;
    iconBg?: string;
    isActive?: boolean;
}

export async function getAllSocialLinksAction(includeInactive = false) {
    try {
        const socialLinks = await prisma.socialLink.findMany({
            where: includeInactive ? {} : { isActive: true },
        });
        return { success: true, data: socialLinks };
    } catch (error) {
        console.error("Failed to fetch social links:", error);
        return { success: false, error: "Failed to fetch social links" };
    }
}

export async function createSocialLinkAction(formData: SocialLinkFormData) {
    try {
        const { name, username, description, url, iconName, iconBg, isActive } = formData;

        if (!name || !username || !url || !iconName) {
            return { success: false, error: "name, username, url, and iconName are required" };
        }

        const socialLink = await prisma.socialLink.create({
            data: {
                name,
                username,
                description,
                url,
                iconName,
                iconBg,
                isActive: isActive ?? true,
            },
        });

        // Revalidate pages that display social links
        revalidatePath("/");
        revalidatePath("/contact");

        return { success: true, data: socialLink };
    } catch (error) {
        console.error("Failed to create social link:", error);
        return { success: false, error: "Failed to create social link" };
    }
}

export async function updateSocialLinkAction(id: string, formData: SocialLinkFormData) {
    try {
        const { name, username, description, url, iconName, iconBg, isActive } = formData;

        const existingSocialLink = await prisma.socialLink.findUnique({
            where: { id },
        });

        if (!existingSocialLink) {
            return { success: false, error: "Social link not found" };
        }

        const socialLink = await prisma.socialLink.update({
            where: { id },
            data: {
                name,
                username,
                description,
                url,
                iconName,
                iconBg,
                isActive,
            },
        });

        // Revalidate pages that display social links
        revalidatePath("/");
        revalidatePath("/contact");

        return { success: true, data: socialLink };
    } catch (error) {
        console.error("Failed to update social link:", error);
        return { success: false, error: "Failed to update social link" };
    }
}

export async function deleteSocialLinkAction(id: string) {
    try {
        const socialLink = await prisma.socialLink.findUnique({
            where: { id },
        });

        if (!socialLink) {
            return { success: false, error: "Social link not found" };
        }

        await prisma.socialLink.delete({
            where: { id },
        });

        // Revalidate pages that display social links
        revalidatePath("/");
        revalidatePath("/contact");

        return { success: true, message: "Social link deleted successfully" };
    } catch (error) {
        console.error("Failed to delete social link:", error);
        return { success: false, error: "Failed to delete social link" };
    }
}
