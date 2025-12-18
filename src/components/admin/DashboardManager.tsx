"use client";

import Link from "next/link";
import { IconType } from "react-icons";
import { MdFolder, MdLocalOffer, MdLink, MdLocationOn, MdAdd, MdLightbulb, MdChevronRight } from "react-icons/md";
import type { DashboardStats } from "@/types/types";

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
        { title: "Total Projects", value: stats.projects, icon: MdFolder, iconColor: "text-amber-500", iconBg: "bg-amber-50", href: "/admin/projects" },
        { title: "Total Tags", value: stats.tags, icon: MdLocalOffer, iconColor: "text-blue-500", iconBg: "bg-blue-50", href: "/admin/projects" },
        { title: "Social Links", value: stats.socialLinks, icon: MdLink, iconColor: "text-purple-500", iconBg: "bg-purple-50", href: "/admin/social-links" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-500">Selamat datang di Admin Panel</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link key={card.title} href={card.href} className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${card.iconBg}`}><Icon className={`w-8 h-8 ${card.iconColor}`} /></div>
                                <div className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold">View All</div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">{card.value}</div>
                            <div className="text-gray-500 text-sm">{card.title}</div>
                        </Link>
                    );
                })}
            </div>
            <Link href="/admin/location" className="block bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-rose-50 rounded-2xl"><MdLocationOn className="w-8 h-8 text-rose-500" /></div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Location</h3>
                        {stats.hasLocation ? (
                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /><span className="text-green-600 text-sm">{stats.locationName}</span></div>
                        ) : (
                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500" /><span className="text-yellow-600 text-sm">Not configured</span></div>
                        )}
                    </div>
                    <div className="text-gray-400"><MdChevronRight className="w-6 h-6" /></div>
                </div>
            </Link>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/admin/projects?action=create" className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                        <div className="p-3 bg-blue-50 rounded-xl"><MdAdd className="w-6 h-6 text-blue-600" /></div>
                        <div><div className="text-gray-900 font-medium">Add New Project</div><div className="text-gray-500 text-sm">Create a new project entry</div></div>
                    </Link>
                    <Link href="/admin/social-links?action=create" className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-300">
                        <div className="p-3 bg-purple-50 rounded-xl"><MdLink className="w-6 h-6 text-purple-600" /></div>
                        <div><div className="text-gray-900 font-medium">Add Social Link</div><div className="text-gray-500 text-sm">Add a new social media link</div></div>
                    </Link>
                    <Link href="/admin/location" className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-cyan-300 hover:shadow-md transition-all duration-300">
                        <div className="p-3 bg-cyan-50 rounded-xl"><MdLocationOn className="w-6 h-6 text-cyan-600" /></div>
                        <div><div className="text-gray-900 font-medium">Set Location</div><div className="text-gray-500 text-sm">Configure map location</div></div>
                    </Link>
                </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-yellow-100 rounded-xl"><MdLightbulb className="w-6 h-6 text-yellow-600" /></div>
                    <div><h3 className="text-gray-900 font-semibold mb-1">Tips</h3><p className="text-gray-600 text-sm">Gunakan panel ini untuk mengelola projects, social links, dan lokasi. Semua perubahan akan langsung tersimpan ke database dan tampil di website.</p></div>
                </div>
            </div>
        </div>
    );
}
