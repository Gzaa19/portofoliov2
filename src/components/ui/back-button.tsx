"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BackButtonProps {
    href: string;
    label?: string;
    className?: string;
}

/**
 * BackButton - Navigation back button with hover animation
 * 
 * @example
 * <BackButton href="/projects" label="Back to Projects" />
 */
function BackButton({
    href,
    label = "Go Back",
    className,
}: BackButtonProps) {
    return (
        <Link
            href={href}
            className={cn(
                "inline-flex items-center gap-2 text-gray-400 hover:text-white",
                "transition-all duration-300 group",
                className
            )}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-300"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
            </svg>
            <span className="font-medium">{label}</span>
        </Link>
    );
}

export { BackButton };
