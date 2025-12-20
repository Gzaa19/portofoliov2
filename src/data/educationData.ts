import prisma from "@/lib/prisma";
import type { Education } from "@/types/types";

// Get all educations
export async function getEducations(): Promise<Education[]> {
    try {
        const educations = await prisma.education.findMany({
            where: { isActive: true },
            orderBy: [
                { isCurrent: 'desc' },
                { startDate: 'desc' },
                { order: 'asc' },
            ],
        });

        return educations;
    } catch (error) {
        console.error("Failed to fetch educations:", error);
        return [];
    }
}
