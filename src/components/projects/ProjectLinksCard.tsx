"use client";

import Link from "next/link";
import { GlowCard, Button } from "@/components/ui";
import { LinkIcon, ExternalLinkIcon, GitHubIcon } from "@/components/icons";

interface ProjectLinksCardProps {
    demoUrl?: string | null;
    githubUrl?: string | null;
    className?: string;
}

/**
 * ProjectLinksCard - Card showing project links (demo & github)
 */
export function ProjectLinksCard({ demoUrl, githubUrl, className }: ProjectLinksCardProps) {
    const hasLinks = demoUrl || githubUrl;

    return (
        <GlowCard
            glowColor="green"
            glowPosition="top-right"
            glowSize="sm"
            className={className}
        >
            <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-green-400" />
                    Project Links
                </h3>
                <div className="flex flex-col gap-3">
                    {demoUrl && (
                        <Button asChild className="w-full">
                            <Link href={demoUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLinkIcon className="h-5 w-5 mr-2" />
                                Live Demo
                            </Link>
                        </Button>
                    )}
                    {githubUrl && (
                        <Button variant="outline" asChild className="w-full">
                            <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
                                <GitHubIcon className="h-5 w-5 mr-2" />
                                View on GitHub
                            </Link>
                        </Button>
                    )}
                    {!hasLinks && (
                        <p className="text-gray-500 text-sm text-center py-4">
                            No external links available.
                        </p>
                    )}
                </div>
            </div>
        </GlowCard>
    );
}
