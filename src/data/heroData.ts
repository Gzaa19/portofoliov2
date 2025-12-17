/**
 * Data Access Layer (DAL) for Hero Settings
 * 
 * This file contains functions that directly access the database
 * for hero-related data. Use these in Server Components.
 */

import prisma from "@/lib/prisma";

export type HeroStatus = "available" | "busy" | "new_project";

export interface HeroSettings {
    name: string;
    role: string;
    status: HeroStatus;
}

const defaultHeroSettings: HeroSettings = {
    name: "Gzaaa",
    role: "Full Stack Developer",
    status: "busy",
};

/**
 * Fetch hero settings from the database
 * Returns default values if no settings found or on error
 */
export async function getHeroSettings(): Promise<HeroSettings> {
    try {
        const heroSettings = await prisma.heroSettings.findFirst({
            where: { isActive: true },
        });

        if (!heroSettings) {
            return defaultHeroSettings;
        }

        return {
            name: heroSettings.name,
            role: heroSettings.role,
            status: heroSettings.status as HeroStatus,
        };
    } catch (error) {
        console.error("Error fetching hero settings:", error);
        return defaultHeroSettings;
    }
}
