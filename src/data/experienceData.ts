import prisma from "@/lib/prisma";
import type { Experience } from "@/types/types";

// Get all experiences
export async function getExperiences(): Promise<Experience[]> {
    try {
        const experiences = await prisma.experience.findMany({
            where: { isActive: true },
            include: {
                skills: true,
            },
            orderBy: [
                { isCurrent: 'desc' },
                { startDate: 'desc' },
                { order: 'asc' },
            ],
        });

        // Transform data to match Experience interface
        return experiences.map(exp => ({
            ...exp,
            skills: exp.skills.map(s => s.skillName),
            employmentType: exp.employmentType as any,
            locationType: exp.locationType as any,
        }));
    } catch (error) {
        console.error("Failed to fetch experiences:", error);
        return [];
    }
}
