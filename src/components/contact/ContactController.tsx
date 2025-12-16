

import { ContactView } from "@/components/contact/ContactView";
import prisma from "@/lib/prisma";

async function getSocialLinks() {
    const socialLinks = await prisma.socialLink.findMany({
        where: {
            isActive: true,
        },
    });
    return socialLinks;
}

export default async function ContactController() {
    const socialLinks = await getSocialLinks();

    return (
        <ContactView
            socialLinks={socialLinks as any}
        />
    );
}
