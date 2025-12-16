import { prisma } from "@/lib/prisma";
import { AboutView } from "@/components/about/AboutView";

// Cache for 1 hour to improve performance
export const revalidate = 3600;

async function getProfile() {
    try {
        const profile = await prisma.profile.findFirst({
            where: { isActive: true },
        });
        return profile;
    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

async function getToolboxCategories() {
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
        return categories;
    } catch (error) {
        console.error("Error fetching toolbox categories:", error);
        return [];
    }
}

export default async function AboutPage() {
    const profile = await getProfile();
    const toolboxCategories = await getToolboxCategories();

    return (
        <AboutView
            initialData={profile ? {
                description: profile.description,
                photoUrl: profile.photoUrl,
                resumeUrl: profile.resumeUrl
            } : undefined}
            toolboxCategories={toolboxCategories}
        />
    );
}
