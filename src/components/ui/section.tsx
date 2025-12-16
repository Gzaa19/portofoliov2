"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
    id?: string;
    children: ReactNode;
    className?: string;
    containerClassName?: string;
    fullWidth?: boolean;
}

/**
 * Reusable Section component for consistent page sections
 */
export function Section({
    id,
    children,
    className,
    containerClassName,
    fullWidth = false
}: SectionProps) {
    return (
        <section id={id} className={cn("py-16 lg:py-24", className)}>
            {fullWidth ? (
                children
            ) : (
                <div className={cn("container mx-auto px-4", containerClassName)}>
                    {children}
                </div>
            )}
        </section>
    );
}

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    centered?: boolean;
    className?: string;
}

/**
 * Reusable Section Header with title and optional subtitle
 */
export function SectionHeader({
    title,
    subtitle,
    centered = true,
    className
}: SectionHeaderProps) {
    return (
        <div className={cn(
            "mb-12 animate-fade-in-up",
            centered && "text-center",
            className
        )}>
            <h2 className="section-title">{title}</h2>
            {subtitle && (
                <p className="mt-4 text-gray-500 md:text-lg font-sans max-w-md mx-auto">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
