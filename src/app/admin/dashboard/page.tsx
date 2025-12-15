import prisma from "@/lib/prisma";
import { DashboardManager } from "@/components/admin";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getStats() {
    const [projectCount, tagCount, socialLinkCount, location] = await Promise.all([
        prisma.project.count(),
        prisma.tag.count(),
        prisma.socialLink.count(),
        prisma.location.findFirst({ where: { isActive: true } }),
    ]);

    return {
        projects: projectCount,
        tags: tagCount,
        socialLinks: socialLinkCount,
        hasLocation: !!location,
        locationName: location?.name,
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return <DashboardManager initialStats={stats} />;
}
