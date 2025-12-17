"use client";

import Link from "next/link";
import { ArrowIcon, GitHubIcon, LinkedInIcon, EmailIcon, InstagramIcon, DiscordIcon, SpotifyIcon } from "@/components/SocialIcons";
import { PageLayout, PageHeader, GlowCard } from "@/components/ui";
import type { SocialLink } from "@/data";

interface ContactViewProps {
    socialLinks: SocialLink[];
}

// Map iconName to actual component
const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
    GitHubIcon,
    LinkedInIcon,
    EmailIcon,
    InstagramIcon,
    DiscordIcon,
    SpotifyIcon,
};

export const ContactView = ({ socialLinks }: ContactViewProps) => {
    return (
        <PageLayout particleCount={800} containerClassName="max-w-5xl">
            {/* Header */}
            <div className="pointer-events-auto">
                <PageHeader
                    title="Let's Connect"
                    description="Feel free to reach out through any of these platforms. I'm always open to new opportunities and collaborations!"
                />
            </div>

            {/* Social Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pointer-events-auto">
                {socialLinks.map((social) => {
                    const IconComponent = iconMap[social.iconName] || iconMap['GitHubIcon'];

                    return (
                        <GlowCard
                            key={social.id}
                            glowColor="blue"
                            glowPosition="center"
                            glowSize="sm"
                            className="hover:border-gray-500 transition-all duration-300 cursor-pointer group"
                            animate={false}
                        >
                            <Link
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-6"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className="p-3 rounded-xl bg-gray-800 border border-gray-600 group-hover:bg-gray-700 group-hover:scale-110 transition-all duration-300 shadow-sm relative overflow-hidden">
                                        <IconComponent className="relative z-10" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors">
                                            {social.name}
                                        </h3>
                                        <p className="text-gray-400 text-sm font-medium">
                                            {social.username}
                                        </p>
                                        {social.description && (
                                            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                                                {social.description}
                                            </p>
                                        )}

                                        {/* Visit Button */}
                                        <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-gray-300 transition-colors group/link">
                                            Visit Profile
                                            <ArrowIcon className="transform group-hover/link:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </GlowCard>
                    );
                })}
            </div>

            {socialLinks.length === 0 && (
                <div className="text-center text-gray-400 py-16 pointer-events-auto">
                    <p>Belum ada social links yang ditambahkan.</p>
                </div>
            )}
        </PageLayout>
    );
};
