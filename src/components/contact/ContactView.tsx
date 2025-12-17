"use client";

import Link from "next/link";
import { ArrowIcon } from "@/components/SocialIcons";
import { SectionCard } from "@/components/SectionCard";
import AntigravityWrapper from "@/components/AntigravityWrapper";
import GradientText from "@/components/GradientText";
import {
    GitHubIcon,
    LinkedInIcon,
    EmailIcon,
    InstagramIcon,
    DiscordIcon,
    SpotifyIcon
} from "@/components/SocialIcons";

// Define SocialLink type here or import from a shared types file
interface SocialLink {
    id: string;
    name: string;
    username: string;
    description: string | null;
    url: string;
    iconName: string;
    iconBg: string;
    isActive: boolean;
}

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
        <div className="min-h-screen py-32 px-4 relative">
            {/* Antigravity Particles */}
            <AntigravityWrapper
                count={800}
                magnetRadius={18}
                ringRadius={12}
                waveSpeed={0.3}
                waveAmplitude={1.2}
                particleSize={0.8}
                lerpSpeed={0.08}
                color={'#4285F4'}
                autoAnimate={true}
                particleVariance={2}
            />

            <div className="container mx-auto max-w-5xl relative z-10 pointer-events-none">
                {/* Header */}
                <div className="text-center mb-16 pointer-events-auto">
                    <GradientText
                        colors={['#4285f4', '#9b72cb', '#d96570', '#9b72cb', '#4285f4']}
                        animationSpeed={6}
                        className="section-title"
                    >
                        Let's Connect
                    </GradientText>
                    <p className="mt-4 text-gray-500 md:text-lg font-sans max-w-md mx-auto">
                        Feel free to reach out through any of these platforms. I'm always open to new opportunities and collaborations!
                    </p>
                </div>

                {/* Social Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pointer-events-auto">
                    {socialLinks.map((social) => {
                        const IconComponent = iconMap[social.iconName] || iconMap['GitHubIcon'];

                        return (
                            <SectionCard
                                key={social.id}
                                className="hover:border-gray-500 transition-all duration-300 cursor-pointer group"
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
                                            {/* Glow effect matching brand color on hover */}
                                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${(social.iconBg || '').replace('bg-', 'bg-')}`} />

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
                            </SectionCard>
                        );
                    })}
                </div>

                {socialLinks.length === 0 && (
                    <div className="text-center text-gray-400 py-16">
                        <p>Belum ada social links yang ditambahkan.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
