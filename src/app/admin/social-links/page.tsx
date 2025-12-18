import prisma from "@/lib/prisma";
import { SocialLinksManager } from "@/components/admin";

async function getSocialLinks() {
    const socialLinks = await prisma.socialLink.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return socialLinks.map((link) => ({
        id: link.id,
        name: link.name,
        username: link.username,
        description: link.description ?? undefined,
        url: link.url,
        iconName: link.iconName,
        iconBg: link.iconBg ?? undefined,
        isActive: link.isActive,
    }));
}

export default async function AdminSocialLinksPage() {
    const socialLinks = await getSocialLinks();

    return <SocialLinksManager initialSocialLinks={socialLinks} />;
}
