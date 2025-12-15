"use client";

import Link from "next/link";
import { IconType } from "react-icons";
import { MdFolder, MdLocalOffer, MdLink, MdLocationOn, MdAdd, MdLightbulb, MdChevronRight } from "react-icons/md";

export interface DashboardStats {
    projects: number;
    tags: number;
    socialLinks: number;
    hasLocation: boolean;
    locationName?: string;
}

interface DashboardManagerProps {
    initialStats: DashboardStats;
}

interface StatCard {
    title: string;
    value: number;
    icon: IconType;
    iconColor: string;
    iconBg: string;
    href: string;
}

export function DashboardManager({ initialStats }: DashboardManagerProps) {
    const stats = initialStats;

    const statCards: StatCard[] = [
        { title: "Total Projects", value: stats.projects, icon: MdFolder, iconColor: "text-amber-400", iconBg: "bg-amber-500/20", href: "/admin/projects" },
        { title: "Total Tags", value: stats.tags, icon: MdLocalOffer, iconColor: "text-blue-400", iconBg: "bg-blue-500/20", href: "/admin/projects" },
        { title: "Social Links", value: stats.socialLinks, icon: MdLink, iconColor: "text-purple-400", iconBg: "bg-purple-500/20", href: "/admin/social-links" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-white/50">Selamat datang di Admin Panel</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link key={card.title} href={card.href} className="group bg-gray-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${card.iconBg}`}><Icon className={`w-8 h-8 ${card.iconColor}`} /></div>
                                <div className="px-3 py-1 rounded-full bg-emerald-500 text-gray-900 text-xs font-semibold">View All</div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{card.value}</div>
                            <div className="text-white/50 text-sm">{card.title}</div>
                        </Link>
                    );
                })}
            </div>
            <Link href="/admin/location" className="block bg-gray-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-rose-500/20 rounded-2xl"><MdLocationOn className="w-8 h-8 text-rose-400" /></div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">Location</h3>
                        {stats.hasLocation ? (
                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /><span className="text-emerald-400 text-sm">{stats.locationName}</span></div>
                        ) : (
                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400" /><span className="text-yellow-400 text-sm">Not configured</span></div>
                        )}
                    </div>
                    <div className="text-white/30"><MdChevronRight className="w-6 h-6" /></div>
                </div>
            </Link>
            <div className="bg-gray-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/admin/projects?action=create" className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-xl border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
                        <div className="p-3 bg-emerald-500/20 rounded-xl"><MdAdd className="w-6 h-6 text-emerald-400" /></div>
                        <div><div className="text-white font-medium">Add New Project</div><div className="text-white/50 text-sm">Create a new project entry</div></div>
                    </Link>
                    <Link href="/admin/social-links?action=create" className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                        <div className="p-3 bg-purple-500/20 rounded-xl"><MdLink className="w-6 h-6 text-purple-400" /></div>
                        <div><div className="text-white font-medium">Add Social Link</div><div className="text-white/50 text-sm">Add a new social media link</div></div>
                    </Link>
                    <Link href="/admin/location" className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
                        <div className="p-3 bg-cyan-500/20 rounded-xl"><MdLocationOn className="w-6 h-6 text-cyan-400" /></div>
                        <div><div className="text-white font-medium">Set Location</div><div className="text-white/50 text-sm">Configure map location</div></div>
                    </Link>
                </div>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-yellow-500/20 rounded-xl"><MdLightbulb className="w-6 h-6 text-yellow-400" /></div>
                    <div><h3 className="text-white font-semibold mb-1">Tips</h3><p className="text-white/70 text-sm">Gunakan panel ini untuk mengelola projects, social links, dan lokasi. Semua perubahan akan langsung tersimpan ke database dan tampil di website.</p></div>
                </div>
            </div>
        </div>
    );
}
