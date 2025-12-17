"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { GradientText } from "./gradient-text";

interface PageHeaderProps {
    title: string;
    description?: string;
    className?: string;
    gradientColors?: string[];
    children?: React.ReactNode;
}

/**
 * PageHeader - Consistent page header with gradient title
 * 
 * @example
 * <PageHeader 
 *   title="My Projects"
 *   description="A collection of my work"
 * />
 */
function PageHeader({
    title,
    description,
    className,
    gradientColors = ['#4285f4', '#9b72cb', '#d96570', '#9b72cb', '#4285f4'],
    children,
}: PageHeaderProps) {
    return (
        <div className={cn("text-center mb-16", className)}>
            <GradientText
                colors={gradientColors}
                animationSpeed={6}
                className="section-title"
            >
                {title}
            </GradientText>

            {description && (
                <p className="mt-4 text-gray-500 md:text-lg font-sans max-w-2xl mx-auto leading-relaxed">
                    {description}
                </p>
            )}

            {children}
        </div>
    );
}

export { PageHeader };
