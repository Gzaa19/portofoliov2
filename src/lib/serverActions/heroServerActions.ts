"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface HeroFormData {
    name: string;
    role: string;
    status: "available" | "busy" | "new_project";
}

export async function getHeroSettingsAction() {
    try {
        let heroSettings = await prisma.heroSettings.findFirst({
            where: { isActive: true },
        });

        if (!heroSettings) {
            heroSettings = await prisma.heroSettings.create({
                data: {
                    name: "Gzaaa",
                    role: "Full Stack Developer",
                    status: "busy",
                    isActive: true,
                },
            });
        }

        return { success: true, data: heroSettings };
    } catch (error) {
        console.error("Failed to fetch hero settings:", error);
        return { success: false, error: "Failed to fetch hero settings" };
    }
}

export async function updateHeroSettingsAction(formData: HeroFormData) {
    try {
        const { name, role, status } = formData;

        let heroSettings = await prisma.heroSettings.findFirst({
            where: { isActive: true },
        });

        if (heroSettings) {
            heroSettings = await prisma.heroSettings.update({
                where: { id: heroSettings.id },
                data: { name, role, status },
            });
        } else {
            heroSettings = await prisma.heroSettings.create({
                data: {
                    name,
                    role,
                    status,
                    isActive: true,
                },
            });
        }

        // Revalidate homepage where hero is displayed
        revalidatePath("/");

        return { success: true, data: heroSettings };
    } catch (error) {
        console.error("Failed to update hero settings:", error);
        return { success: false, error: "Failed to update hero settings" };
    }
}
