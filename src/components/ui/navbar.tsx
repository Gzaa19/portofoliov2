"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
    href: string;
    label: string;
}

const navItems: NavItem[] = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" },
];

interface NavbarProps {
    className?: string;
}

/**
 * Navigation bar component with animated active state
 */
export function Navbar({ className }: NavbarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Backdrop Blur */}
            <div
                className="fixed top-0 left-0 right-0 h-24 z-40 pointer-events-none backdrop-blur-md"
                style={{
                    maskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
                }}
            />

            {/* Navbar Container */}
            <div className={cn(
                "flex justify-center items-center fixed top-3 w-full z-50 animate-fade-in-up",
                className
            )}>
                <nav className="flex gap-1 p-0.5 border border-gray-200 rounded-full bg-white/80 backdrop-blur-lg shadow-lg shadow-black/5">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "nav-item relative z-10 flex items-center justify-center transition-all duration-300",
                                    isActive && "nav-item--active"
                                )}
                            >
                                <span className="relative z-20">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}

export default Navbar;
