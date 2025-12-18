"use client";

import { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import { IconType } from "react-icons";
import { MdSearch, MdClose, MdLink, MdDelete } from "react-icons/md";
import type { SocialLink } from "@/types/types";

interface SocialLinksManagerProps {
    initialSocialLinks: SocialLink[];
}

interface SocialLinkFormData {
    name: string;
    username: string;
    description: string;
    url: string;
    iconName: string;
    iconBg: string;
    isActive: boolean;
}

const initialFormData: SocialLinkFormData = {
    name: "",
    username: "",
    description: "",
    url: "",
    iconName: "",
    iconBg: "#FFFFFF",
    isActive: true,
};

// Common social platform presets
const socialPresets = [
    { name: "GitHub", iconName: "FaGithub", iconBg: "#333333", urlPrefix: "https://github.com/" },
    { name: "LinkedIn", iconName: "FaLinkedin", iconBg: "#0A66C2", urlPrefix: "https://linkedin.com/in/" },
    { name: "Twitter", iconName: "FaTwitter", iconBg: "#1DA1F2", urlPrefix: "https://twitter.com/" },
    { name: "Instagram", iconName: "FaInstagram", iconBg: "#E4405F", urlPrefix: "https://instagram.com/" },
    { name: "Discord", iconName: "FaDiscord", iconBg: "#5865F2", urlPrefix: "" },
    { name: "Email", iconName: "FaEnvelope", iconBg: "#EA4335", urlPrefix: "mailto:" },
    { name: "Spotify", iconName: "FaSpotify", iconBg: "#1DB954", urlPrefix: "https://open.spotify.com/user/" },
    { name: "YouTube", iconName: "FaYoutube", iconBg: "#FF0000", urlPrefix: "https://youtube.com/@" },
    { name: "Dribbble", iconName: "FaDribbble", iconBg: "#EA4C89", urlPrefix: "https://dribbble.com/" },
    { name: "Behance", iconName: "FaBehance", iconBg: "#1769FF", urlPrefix: "https://behance.net/" },
];

export function SocialLinksManager({ initialSocialLinks }: SocialLinksManagerProps) {
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialSocialLinks);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
    const [formData, setFormData] = useState<SocialLinkFormData>(initialFormData);
    const [iconSearch, setIconSearch] = useState("");

    const getIcon = (iconName: string): IconType | null => {
        const faIcons = FaIcons as Record<string, IconType>;
        const siIcons = SiIcons as Record<string, IconType>;
        return faIcons[iconName] || siIcons[iconName] || null;
    };

    const fetchSocialLinks = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/social-links", { cache: 'no-store' });
            const data = await res.json();
            setSocialLinks(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingLink(null);
        setFormData(initialFormData);
        setIconSearch("");
        setIsModalOpen(true);
    };

    const openEditModal = (link: SocialLink) => {
        setEditingLink(link);
        setFormData({
            name: link.name,
            username: link.username,
            description: link.description || "",
            url: link.url,
            iconName: link.iconName,
            iconBg: link.iconBg || "#FFFFFF",
            isActive: link.isActive,
        });
        setIconSearch("");
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingLink) {
                await fetch(`/api/social-links/${editingLink.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
            } else {
                await fetch("/api/social-links", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
            }
            setIsModalOpen(false);
            fetchSocialLinks();
        } catch (error) {
            console.error("Failed to save:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin hapus social link ini?")) return;
        try {
            await fetch(`/api/social-links/${id}`, { method: "DELETE" });
            fetchSocialLinks();
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    const handleToggleActive = async (link: SocialLink) => {
        try {
            await fetch(`/api/social-links/${link.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !link.isActive }),
            });
            fetchSocialLinks();
        } catch (error) {
            console.error("Failed to toggle:", error);
        }
    };

    const selectPreset = (preset: typeof socialPresets[0]) => {
        setFormData({
            ...formData,
            name: preset.name,
            iconName: preset.iconName,
            iconBg: preset.iconBg,
            url: preset.urlPrefix,
        });
    };

    // Filter icons based on search
    const allIconNames = [
        ...Object.keys(FaIcons).filter(k => k.startsWith('Fa')),
        ...Object.keys(SiIcons).filter(k => k.startsWith('Si')),
    ];
    const filteredIcons = iconSearch.trim()
        ? allIconNames.filter(name => name.toLowerCase().includes(iconSearch.toLowerCase())).slice(0, 30)
        : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Social Links</h1>
                    <p className="text-gray-500">Kelola social links yang ditampilkan di Contact page</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25"
                >
                    + Add Link
                </button>
            </div>

            {/* Social Links Grid */}
            {isLoading ? (
                <div className="text-center text-gray-500 py-8">Loading...</div>
            ) : socialLinks.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                    <MdLink className="text-6xl mb-4 text-blue-600 mx-auto" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada social links</h3>
                    <p className="text-gray-500 mb-6">Tambahkan social link untuk ditampilkan di Contact page</p>
                    <button
                        onClick={openAddModal}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/25"
                    >
                        + Add Link
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {socialLinks.map((link) => {
                        const IconComp = getIcon(link.iconName);
                        return (
                            <div
                                key={link.id}
                                className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: link.iconBg ? `${link.iconBg}20` : 'rgba(0,0,0,0.05)' }}
                                    >
                                        {IconComp && <IconComp className="w-6 h-6" style={{ color: link.iconBg || '#374151' }} />}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-gray-900 font-semibold truncate">{link.name}</h3>
                                            <span
                                                className={`px-2 py-0.5 text-xs rounded-full ${link.isActive
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-red-100 text-red-600"
                                                    }`}
                                            >
                                                {link.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                        <p className="text-gray-500 text-sm truncate">@{link.username}</p>
                                        {link.description && (
                                            <p className="text-gray-400 text-xs mt-1 line-clamp-1">{link.description}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => openEditModal(link)}
                                        className="flex-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleToggleActive(link)}
                                        className={`flex-1 px-3 py-1.5 text-sm rounded-lg transition-colors font-medium ${link.isActive
                                            ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                                            : "bg-green-50 text-green-600 hover:bg-green-100"
                                            }`}
                                    >
                                        {link.isActive ? "Hide" : "Show"}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(link.id)}
                                        className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <MdDelete />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl">
                        <div className="p-6 border-b border-gray-200 shrink-0">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingLink ? "Edit Social Link" : "Add Social Link"}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                            {/* Quick Select Presets */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quick Select</label>
                                <div className="flex flex-wrap gap-2">
                                    {socialPresets.map((preset) => {
                                        const IconComp = getIcon(preset.iconName);
                                        const isSelected = formData.iconName === preset.iconName;
                                        return (
                                            <button
                                                key={preset.name}
                                                type="button"
                                                onClick={() => selectPreset(preset)}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${isSelected
                                                    ? "bg-blue-50 border border-blue-500"
                                                    : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                                                    }`}
                                            >
                                                {IconComp && <IconComp className="w-4 h-4" style={{ color: preset.iconBg }} />}
                                                <span className={`text-xs ${isSelected ? "text-blue-600 font-medium" : "text-gray-600"}`}>
                                                    {preset.name}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Icon Search */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search Icon</label>
                                <div className="relative">
                                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={iconSearch}
                                        onChange={(e) => setIconSearch(e.target.value)}
                                        className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="Search icons..."
                                    />
                                    {iconSearch && (
                                        <button
                                            type="button"
                                            onClick={() => setIconSearch("")}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <MdClose />
                                        </button>
                                    )}
                                </div>
                                {filteredIcons.length > 0 && (
                                    <div className="mt-2 bg-gray-50 border border-gray-200 rounded-xl p-3 max-h-32 overflow-y-auto">
                                        <div className="grid grid-cols-6 gap-2">
                                            {filteredIcons.map((iconName) => {
                                                const IconComp = getIcon(iconName);
                                                const isSelected = formData.iconName === iconName;
                                                return (
                                                    <button
                                                        key={iconName}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData({ ...formData, iconName });
                                                            setIconSearch("");
                                                        }}
                                                        className={`flex flex-col items-center p-2 rounded-lg transition-all ${isSelected
                                                            ? "bg-blue-50 border border-blue-500"
                                                            : "bg-white border border-gray-200 hover:bg-gray-100"
                                                            }`}
                                                        title={iconName}
                                                    >
                                                        {IconComp && <IconComp className="w-5 h-5" style={{ color: formData.iconBg }} />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="GitHub"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="username"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                                <input
                                    type="text"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    placeholder="https://github.com/username"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    placeholder="Follow me on GitHub"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Icon Name</label>
                                    <input
                                        type="text"
                                        value={formData.iconName}
                                        onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="FaGithub"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Icon Color</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={formData.iconBg}
                                            onChange={(e) => setFormData({ ...formData, iconBg: e.target.value })}
                                            className="w-12 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                                        />
                                        <input
                                            type="text"
                                            value={formData.iconBg}
                                            onChange={(e) => setFormData({ ...formData, iconBg: e.target.value })}
                                            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${formData.isActive ? "bg-blue-600" : "bg-gray-300"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${formData.isActive ? "left-7" : "left-1"
                                            }`}
                                    />
                                </button>
                                <span className="text-gray-600 text-sm">
                                    {formData.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>

                            {/* Preview */}
                            {formData.iconName && (
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                                    <span className="text-gray-500 text-sm">Preview:</span>
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: formData.iconBg ? `${formData.iconBg}20` : 'rgba(0,0,0,0.05)' }}
                                    >
                                        {(() => {
                                            const IconComp = getIcon(formData.iconName);
                                            return IconComp ? (
                                                <IconComp className="w-5 h-5" style={{ color: formData.iconBg }} />
                                            ) : (
                                                <span className="text-red-500 text-xs">?</span>
                                            );
                                        })()}
                                    </div>
                                    <div>
                                        <div className="text-gray-900 font-medium">{formData.name || "Name"}</div>
                                        <div className="text-gray-500 text-sm">@{formData.username || "username"}</div>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/25"
                                >
                                    {editingLink ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
