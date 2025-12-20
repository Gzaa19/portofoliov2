"use client";

import PillNav from "@/components/PillNav";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" },
];

/**
 * Header section - wraps the PillNav component
 * PillNav now uses theme colors from theme.ts by default
 */
export function Header() {
    const pathname = usePathname();

    return (
        <>
            {/* Ambient Top Blur Mask */}
            <div
                className="fixed top-0 left-0 right-0 h-32 z-900 pointer-events-none backdrop-blur-md"
                style={{
                    maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)"
                }}
            />

            {/* Theme Toggle - Fixed Top Left */}
            <div className="fixed top-4 left-4 z-1001 pointer-events-auto">
                <ThemeToggle />
            </div>

            <div className="flex w-full justify-center">
                <PillNav
                    items={navItems}
                    activeHref={pathname}
                    baseColor="var(--theme-nav-bg)"
                    pillColor="var(--theme-nav-pill-bg)"
                    pillTextColor="var(--theme-text-heading)"
                    hoveredPillTextColor="var(--theme-primary)"
                />
            </div>
        </>
    );
}