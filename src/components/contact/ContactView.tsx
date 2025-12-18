"use client";

import Link from "next/link";
import { ArrowIcon, GitHubIcon, LinkedInIcon, EmailIcon, InstagramIcon, DiscordIcon, SpotifyIcon } from "@/components/SocialIcons";
import { PageLayout, PageHeader, GlowCard, Animated } from "@/components/ui";
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

// Map icon to brand colors
const iconColorMap: Record<string, string> = {
    GitHubIcon: "#181717",      // GitHub black
    EmailIcon: "#EA4335",       // Gmail red
    LinkedInIcon: "#0A66C2",    // LinkedIn blue
    InstagramIcon: "#E4405F",   // Instagram pink
    DiscordIcon: "#5865F2",     // Discord purple
    SpotifyIcon: "#1DB954",     // Spotify green
};

export const ContactView = ({ socialLinks }: ContactViewProps) => {
    return (
        <PageLayout showParticles={false} containerClassName="max-w-5xl">
            {/* Header */}
            <div className="pointer-events-auto">
                <PageHeader
                    title="Let's Connect"
                    description="Feel free to reach out through any of these platforms. I'm always open to new opportunities and collaborations!"
                />
            </div>

            {/* Social Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pointer-events-auto">
                {socialLinks.map((social, index) => {
                    const IconComponent = iconMap[social.iconName] || iconMap['GitHubIcon'];
                    const iconColor = iconColorMap[social.iconName] || "#2563EB"; // Default blue
                    const delay = Math.min(index * 100, 500) as 0 | 100 | 200 | 300 | 400 | 500;

                    return (
                        <Animated key={social.id} className="h-full" delay={delay}>
                            <GlowCard
                                glowColor="primary"
                                glowPosition="center"
                                glowSize="sm"
                                className="hover:scale-[1.02] transition-all duration-300 cursor-pointer group h-full"
                                animate={true}
                            >
                                <Link
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-6 h-full"
                                >
                                    <div className="flex items-start gap-4 h-full">
                                        {/* Icon */}
                                        <div
                                            className="p-3 rounded-xl group-hover:scale-110 transition-all duration-300 relative overflow-hidden"
                                            style={{
                                                backgroundColor: 'var(--theme-bg-secondary)',
                                                borderColor: 'var(--theme-card-border)'
                                            }}
                                        >
                                            <IconComponent
                                                className="relative z-10 w-10 h-10"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3
                                                className="font-semibold text-lg transition-colors"
                                                style={{ color: 'var(--theme-text-heading)' }}
                                            >
                                                {social.name}
                                            </h3>
                                            <p
                                                className="text-sm font-medium"
                                                style={{ color: 'var(--theme-text-muted)' }}
                                            >
                                                {social.username}
                                            </p>
                                            {social.description && (
                                                <p
                                                    className="text-sm mt-2 leading-relaxed"
                                                    style={{ color: 'var(--theme-text-body)' }}
                                                >
                                                    {social.description}
                                                </p>
                                            )}

                                            {/* Visit Button */}
                                            <div
                                                className="mt-4 inline-flex items-center gap-2 text-sm font-medium transition-colors group/link"
                                                style={{ color: 'var(--theme-primary)' }}
                                            >
                                                Visit Profile
                                                <ArrowIcon className="transform group-hover/link:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </GlowCard>
                        </Animated>
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
