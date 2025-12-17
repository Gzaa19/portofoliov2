"use client";

import { useState } from "react";
import type { SocialLink } from "@/types/types";

const iconOptions = [
    { name: "GitHubIcon", label: "GitHub" },
    { name: "LinkedInIcon", label: "LinkedIn" },
    { name: "EmailIcon", label: "Email" },
    { name: "InstagramIcon", label: "Instagram" },
    { name: "DiscordIcon", label: "Discord" },
    { name: "SpotifyIcon", label: "Spotify" },
];

interface SocialLinksManagerProps {
    initialSocialLinks: SocialLink[];
}

export function SocialLinksManager({ initialSocialLinks }: SocialLinksManagerProps) {
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialSocialLinks);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        description: "",
        url: "",
        iconName: "GitHubIcon",
        iconBg: "bg-gray-800",
        isActive: true,
    });

    const fetchSocialLinks = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/social-links?all=true", { cache: 'no-store' });
            const data = await res.json();
            setSocialLinks(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch social links:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingLink(null);
        setFormData({ name: "", username: "", description: "", url: "", iconName: "GitHubIcon", iconBg: "bg-gray-800", isActive: true });
        setIsModalOpen(true);
    };

    const openEditModal = (link: SocialLink) => {
        setEditingLink(link);
        setFormData({ name: link.name, username: link.username, description: link.description || "", url: link.url, iconName: link.iconName, iconBg: link.iconBg || "bg-gray-800", isActive: link.isActive });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingLink) {
                await fetch(`/api/social-links/${editingLink.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
            } else {
                await fetch("/api/social-links", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
            }
            setIsModalOpen(false);
            fetchSocialLinks();
        } catch (error) {
            console.error("Failed to save social link:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus social link ini?")) return;
        try {
            await fetch(`/api/social-links/${id}`, { method: "DELETE" });
            fetchSocialLinks();
        } catch (error) {
            console.error("Failed to delete social link:", error);
        }
    };

    const toggleActive = async (link: SocialLink) => {
        try {
            await fetch(`/api/social-links/${link.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !link.isActive }) });
            fetchSocialLinks();
        } catch (error) {
            console.error("Failed to toggle social link:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Social Links</h1>
                    <p className="text-white/50">Kelola social media links</p>
                </div>
                <button onClick={openCreateModal} className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-900 font-semibold rounded-xl hover:from-emerald-400 hover:to-teal-400 transition-all">+ Add Social Link</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (<div className="col-span-full text-center text-white/50 py-8">Loading...</div>) : socialLinks.length === 0 ? (<div className="col-span-full text-center text-white/50 py-8">Belum ada social links</div>) : (
                    socialLinks.map((link) => (
                        <div key={link.id} className={`bg-gray-800/50 backdrop-blur-md border rounded-2xl p-6 transition-all ${link.isActive ? "border-white/10" : "border-red-500/30 opacity-60"}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${link.iconBg || "bg-gray-800"}`}><span className="text-xl">{iconOptions.find((i) => i.name === link.iconName)?.label?.[0] || "🔗"}</span></div>
                                    <div><h3 className="text-white font-semibold">{link.name}</h3><p className="text-emerald-400 text-sm">{link.username}</p></div>
                                </div>
                                <button onClick={() => toggleActive(link)} className={`px-2 py-1 text-xs rounded-full transition-colors ${link.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{link.isActive ? "Active" : "Inactive"}</button>
                            </div>
                            {link.description && <p className="text-white/50 text-sm mb-4 line-clamp-2">{link.description}</p>}
                            <div className="text-white/30 text-xs mb-4 truncate">{link.url}</div>
                            <div className="flex gap-2">
                                <button onClick={() => openEditModal(link)} className="flex-1 px-3 py-2 text-sm text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors">Edit</button>
                                <button onClick={() => handleDelete(link.id)} className="flex-1 px-3 py-2 text-sm text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors">Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-white/10"><h2 className="text-xl font-bold text-white">{editingLink ? "Edit Social Link" : "Add New Social Link"}</h2></div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-white/70 mb-2">Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50" placeholder="GitHub" required /></div>
                                <div><label className="block text-sm font-medium text-white/70 mb-2">Username</label><input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50" placeholder="@username" required /></div>
                            </div>
                            <div><label className="block text-sm font-medium text-white/70 mb-2">URL</label><input type="url" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} className="w-full px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50" placeholder="https://github.com/username" required /></div>
                            <div><label className="block text-sm font-medium text-white/70 mb-2">Description</label><input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50" placeholder="Check out my projects" /></div>
                            <div><label className="block text-sm font-medium text-white/70 mb-2">Icon</label><select value={formData.iconName} onChange={(e) => setFormData({ ...formData, iconName: e.target.value })} className="w-full px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50">{iconOptions.map((icon) => (<option key={icon.name} value={icon.name}>{icon.label}</option>))}</select></div>
                            <div className="flex items-center gap-3"><input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-5 h-5 rounded bg-gray-900/50 border-white/10" /><label htmlFor="isActive" className="text-white/70">Active</label></div>
                            <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-white/70 hover:text-white transition-colors">Cancel</button><button type="submit" className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-900 font-semibold rounded-xl hover:from-emerald-400 hover:to-teal-400 transition-all">{editingLink ? "Update" : "Create"}</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
