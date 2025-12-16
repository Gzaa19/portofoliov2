"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
    MdFolder,
    MdLink,
    MdLocationOn,
    MdLogout,
    MdChevronLeft,
    MdChevronRight,
    MdBuildCircle,
    MdPerson
} from "react-icons/md";
import { IconType } from "react-icons";

interface AdminLayoutProps {
    children: React.ReactNode;
}

interface NavItem {
    name: string;
    href: string;
    icon: IconType;
}

const navItems: NavItem[] = [
    { name: "About", href: "/admin/about", icon: MdPerson },
    { name: "Projects", href: "/admin/projects", icon: MdFolder },
    { name: "Toolbox", href: "/admin/toolbox", icon: MdBuildCircle },
    { name: "Social Links", href: "/admin/social-links", icon: MdLink },
    { name: "Location", href: "/admin/location", icon: MdLocationOn },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Skip auth check for login page
        if (pathname === "/admin") {
            setIsAuthenticated(true);
            return;
        }

        // Check authentication
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/admin/auth");
                if (res.ok) {
                    setIsAuthenticated(true);
                } else {
                    router.push("/admin");
                }
            } catch {
                router.push("/admin");
            }
        };

        checkAuth();
    }, [pathname, router]);

    const handleLogout = async () => {
        await fetch("/api/admin/auth", { method: "DELETE" });
        router.push("/admin");
    };

    // Show nothing while checking auth
    if (isAuthenticated === null && pathname !== "/admin") {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    // Login page - no sidebar
    if (pathname === "/admin") {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-900 flex">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? "w-64" : "w-20"
                    } bg-gray-800/50 backdrop-blur-md border-r border-white/10 transition-all duration-300 flex flex-col`}
            >
                {/* Sidebar Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    {isSidebarOpen && (
                        <h1 className="text-xl font-bold text-white">Admin</h1>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        {isSidebarOpen ? <MdChevronLeft size={20} /> : <MdChevronRight size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : "text-white/70 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                <Icon size={20} />
                                {isSidebarOpen && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <MdLogout size={20} />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">{children}</main>
        </div>
    );
}
