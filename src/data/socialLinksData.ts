/**
 * Data Access Layer (DAL) for Social Links
 * 
 * This file contains functions that directly access the database
 * for social link-related data. Use these in Server Components.
 */

import prisma from "@/lib/prisma";

export interface SocialLink {
    id: string;
    name: string;
    username: string;
    description: string | null;
    url: string;
    iconName: string;
    iconBg: string | null;
    isActive: boolean;
}

/**
 * Fetch all active social links from the database
 */
export async function getSocialLinks(): Promise<SocialLink[]> {
    try {
        const socialLinks = await prisma.socialLink.findMany({
            where: {
                isActive: true,
            },
        });

        return socialLinks.map((link) => ({
            id: link.id,
            name: link.name,
            username: link.username,
            description: link.description,
            url: link.url,
            iconName: link.iconName,
            iconBg: link.iconBg,
            isActive: link.isActive,
        }));
    } catch (error) {
        console.error("Error fetching social links:", error);
        return [];
    }
}
