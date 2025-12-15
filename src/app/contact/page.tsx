import { motion } from "framer-motion";
import Link from "next/link";
import {
    GitHubIcon,
    LinkedInIcon,
    EmailIcon,
    InstagramIcon,
    DiscordIcon,
    SpotifyIcon,
    ArrowIcon,
} from "@/components/SocialIcons";
import { SectionCard } from "@/components/SectionCard";
import prisma from "@/lib/prisma";

// Map iconName to actual component
const iconMap: Record<string, React.ComponentType> = {
    GitHubIcon,
    LinkedInIcon,
    EmailIcon,
    InstagramIcon,
    DiscordIcon,
    SpotifyIcon,
};

// Fetch social links from database
async function getSocialLinks() {
    const socialLinks = await prisma.socialLink.findMany({
        where: {
            isActive: true,
        },
    });

    return socialLinks;
}

export default async function Contact() {
    const socialLinks = await getSocialLinks();

    return (
        <div className="min-h-screen py-32 px-4">
            <div className="container mx-auto max-w-5xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="uppercase text-lg md:text-xl lg:text-2xl font-semibold tracking-[0.2em] bg-gradient-to-r from-emerald-500 to-teal-300 bg-clip-text text-transparent">
                        Let's Connect
                    </h1>
                    <p className="mt-4 text-white/60 md:text-lg font-sans max-w-md mx-auto">
                        Feel free to reach out through any of these platforms. I'm always open to new opportunities and collaborations!
                    </p>
                </div>

                {/* Social Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {socialLinks.map((social) => {
                        const IconComponent = iconMap[social.iconName] || GitHubIcon;

                        return (
                            <SectionCard
                                key={social.id}
                                className="hover:border-white/20 transition-all duration-300 cursor-pointer"
                            >
                                <Link
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-6"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className={`p-3 rounded-xl ${social.iconBg || 'bg-gray-800'}`}>
                                            <IconComponent />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg text-white">
                                                {social.name}
                                            </h3>
                                            <p className="text-emerald-400 text-sm font-medium">
                                                {social.username}
                                            </p>
                                            {social.description && (
                                                <p className="text-white/50 text-sm mt-1">
                                                    {social.description}
                                                </p>
                                            )}

                                            {/* Visit Button */}
                                            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-sm font-medium text-white/80 hover:text-white hover:border-white/40 transition-colors">
                                                Visit Profile
                                                <ArrowIcon />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </SectionCard>
                        );
                    })}
                </div>

                {socialLinks.length === 0 && (
                    <div className="text-center text-white/50 py-16">
                        <p>Belum ada social links yang ditambahkan.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
