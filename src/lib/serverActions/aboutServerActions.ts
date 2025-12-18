"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface ProfileFormData {
    description: string;
    photoUrl?: string;
    resumeUrl?: string;
}

export async function getProfileAction() {
    try {
        const profile = await prisma.profile.findFirst({
            where: { isActive: true },
        });
        return { success: true, data: profile };
    } catch (error) {
        console.error("Failed to fetch profile:", error);
        return { success: false, error: "Failed to fetch profile" };
    }
}

export async function updateProfileAction(formData: ProfileFormData) {
    try {
        const { description, photoUrl, resumeUrl } = formData;

        const existingProfile = await prisma.profile.findFirst({
            where: { isActive: true },
        });

        let profile;

        if (existingProfile) {
            profile = await prisma.profile.update({
                where: { id: existingProfile.id },
                data: {
                    description,
                    photoUrl,
                    resumeUrl,
                },
            });
        } else {
            profile = await prisma.profile.create({
                data: {
                    description,
                    photoUrl: photoUrl ?? "",
                    resumeUrl: resumeUrl ?? "",
                    isActive: true,
                },
            });
        }

        // Revalidate pages that display about/profile info
        revalidatePath("/");
        revalidatePath("/about");

        return { success: true, data: profile };
    } catch (error) {
        console.error("Failed to update profile:", error);
        return { success: false, error: "Failed to update profile" };
    }
}
