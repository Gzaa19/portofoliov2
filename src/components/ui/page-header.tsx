"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { GradientText } from "./gradient-text";
import { GRADIENT_PRESETS } from "@/lib/theme";

interface PageHeaderProps {
    title: string;
    description?: string;
    className?: string;
    gradientColors?: string[];
    children?: React.ReactNode;
}

/**
 * PageHeader - Consistent page header with gradient title
 * Uses theme from globals.css
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
    gradientColors = GRADIENT_PRESETS.cleanSaas,
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
                <p
                    className="mt-4 md:text-lg font-sans max-w-2xl mx-auto leading-relaxed"
                    style={{ color: 'var(--theme-text-body)' }}
                >
                    {description}
                </p>
            )}

            {children}
        </div>
    );
}

export { PageHeader };

