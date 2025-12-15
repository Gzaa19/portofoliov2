"use client";

import { useState } from "react";
import { techStackOptions } from "@/lib/techStackOptions";
import * as SiIcons from "react-icons/si";
import { IconType } from "react-icons";

export interface Project {
    id: string;
    slug: string;
    title: string;
    description: string;
    image?: string;
    link?: string;
    github?: string;
    featured: boolean;
    tags: { id: string; name: string; slug: string; color?: string }[];
}

interface ProjectsManagerProps {
    initialProjects: Project[];
}

export function ProjectsManager({ initialProjects }: ProjectsManagerProps) {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        slug: "",
        title: "",
        description: "",
        image: "",
        link: "",
        github: "",
        featured: false,
    });

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/projects", { cache: 'no-store' });
            const data = await res.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Get icon component by name
    const getIcon = (iconName: string): IconType | null => {
        const icons = SiIcons as Record<string, IconType>;
        return icons[iconName] || null;
    };

    const openCreateModal = () => {
        setEditingProject(null);
        setSelectedTags([]);
        setFormData({
            slug: "",
            title: "",
            description: "",
            image: "",
            link: "",
            github: "",
            featured: false,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (project: Project) => {
        setEditingProject(project);
        setSelectedTags(project.tags.map((t) => t.name));
        setFormData({
            slug: project.slug,
            title: project.title,
            description: project.description,
            image: project.image || "",
            link: project.link || "",
            github: project.github || "",
            featured: project.featured,
        });
        setIsModalOpen(true);
    };

    const toggleTag = (tagName: string) => {
        setSelectedTags((prev) =>
            prev.includes(tagName)
                ? prev.filter((t) => t !== tagName)
                : [...prev, tagName]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
            tags: selectedTags,
            newSlug: editingProject && formData.slug !== editingProject.slug ? formData.slug : undefined,
        };

        try {
            if (editingProject) {
                await fetch(`/api/projects/${editingProject.slug}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            } else {
                await fetch("/api/projects", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }

            setIsModalOpen(false);
            fetchProjects();
        } catch (error) {
            console.error("Failed to save project:", error);
        }
    };

    const handleDelete = async (slug: string) => {
        if (!confirm("Yakin ingin menghapus project ini?")) return;

        try {
            await fetch(`/api/projects/${slug}`, { method: "DELETE" });
            fetchProjects();
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    };

    // Find tech stack option by tag name
    const getTechStackOption = (tagName: string) => {
        return techStackOptions.find(
            (opt) => opt.name.toLowerCase() === tagName.toLowerCase()
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
                    <p className="text-white/50">Kelola daftar project</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-900 font-semibold rounded-xl hover:from-emerald-400 hover:to-teal-400 transition-all"
                >
                    + Add Project
                </button>
            </div>

            {/* Table */}
            <div className="bg-gray-800/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-white/50">Loading...</div>
                ) : projects.length === 0 ? (
                    <div className="p-8 text-center text-white/50">Belum ada project</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Title</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Tech Stack</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Featured</th>
                                <th className="px-6 py-4 text-right text-sm font-medium text-white/70">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {projects.map((project) => (
                                <tr key={project.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-white font-medium">{project.title}</div>
                                        <div className="text-white/50 text-sm truncate max-w-xs">
                                            {project.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {project.tags.slice(0, 5).map((tag) => {
                                                const techOpt = getTechStackOption(tag.name);
                                                const IconComp = techOpt ? getIcon(techOpt.icon) : null;
                                                return (
                                                    <div
                                                        key={tag.id}
                                                        className="flex items-center gap-1.5 px-2 py-1 bg-gray-700/50 rounded-lg"
                                                        title={tag.name}
                                                    >
                                                        {IconComp && (
                                                            <IconComp
                                                                className="w-4 h-4"
                                                                style={{ color: techOpt?.color }}
                                                            />
                                                        )}
                                                        <span className="text-xs text-white/70">{tag.name}</span>
                                                    </div>
                                                );
                                            })}
                                            {project.tags.length > 5 && (
                                                <span className="px-2 py-1 text-xs text-white/50">
                                                    +{project.tags.length - 5}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${project.featured
                                                ? "bg-yellow-500/20 text-yellow-300"
                                                : "bg-gray-500/20 text-gray-400"
                                                }`}
                                        >
                                            {project.featured ? "Yes" : "No"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => openEditModal(project)}
                                            className="px-3 py-1 text-sm text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.slug)}
                                            className="px-3 py-1 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">
                                {editingProject ? "Edit Project" : "Add New Project"}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Slug</label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50"
                                        placeholder="project-slug"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50"
                                        placeholder="Project Title"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 h-24 resize-none"
                                    placeholder="Project description..."
                                    required
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Project Image</label>
                                <div className="space-y-3">
                                    {/* Image Preview */}
                                    {formData.image && (
                                        <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-900/50 border border-white/10">
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, image: "" })}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}

                                    {/* Upload Area */}
                                    {!formData.image && (
                                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-emerald-500/50 transition-colors bg-gray-900/30">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-10 h-10 text-white/30 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-sm text-white/50">
                                                    <span className="font-medium text-emerald-400">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-white/30 mt-1">PNG, JPG, WEBP (max 5MB)</p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;

                                                    if (file.size > 5 * 1024 * 1024) {
                                                        alert("File size must be less than 5MB");
                                                        return;
                                                    }

                                                    const reader = new FileReader();
                                                    reader.onload = async () => {
                                                        const base64 = reader.result as string;

                                                        try {
                                                            const res = await fetch("/api/upload", {
                                                                method: "POST",
                                                                headers: { "Content-Type": "application/json" },
                                                                body: JSON.stringify({ image: base64 }),
                                                            });

                                                            if (res.ok) {
                                                                const data = await res.json();
                                                                setFormData({ ...formData, image: data.url });
                                                            } else {
                                                                alert("Failed to upload image");
                                                            }
                                                        } catch (error) {
                                                            console.error("Upload error:", error);
                                                            alert("Failed to upload image");
                                                        }
                                                    };
                                                    reader.readAsDataURL(file);
                                                }}
                                            />
                                        </label>
                                    )}

                                    {/* Or enter URL manually */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-px bg-white/10" />
                                        <span className="text-xs text-white/30">or enter URL</span>
                                        <div className="flex-1 h-px bg-white/10" />
                                    </div>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50"
                                        placeholder="https://example.com/image.png"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Live Demo URL</label>
                                    <input
                                        type="url"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50"
                                        placeholder="https://example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">GitHub URL</label>
                                    <input
                                        type="url"
                                        value={formData.github}
                                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50"
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                            </div>

                            {/* Tech Stack Multi-Select */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">
                                    Tech Stack ({selectedTags.length} selected)
                                </label>
                                <div className="bg-gray-900/50 border border-white/10 rounded-xl p-4 max-h-64 overflow-y-auto">
                                    <div className="grid grid-cols-4 gap-2">
                                        {techStackOptions.map((tech) => {
                                            const IconComp = getIcon(tech.icon);
                                            const isSelected = selectedTags.includes(tech.name);
                                            return (
                                                <button
                                                    key={tech.slug}
                                                    type="button"
                                                    onClick={() => toggleTag(tech.name)}
                                                    className={`flex items-center gap-2 p-2 rounded-lg transition-all ${isSelected
                                                        ? "bg-emerald-500/20 border border-emerald-500/50"
                                                        : "bg-gray-800/50 border border-transparent hover:bg-gray-700/50"
                                                        }`}
                                                >
                                                    {IconComp && (
                                                        <IconComp
                                                            className="w-5 h-5 flex-shrink-0"
                                                            style={{ color: tech.color }}
                                                        />
                                                    )}
                                                    <span className={`text-xs truncate ${isSelected ? "text-emerald-300" : "text-white/70"}`}>
                                                        {tech.name}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                {/* Selected Tags Preview */}
                                {selectedTags.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {selectedTags.map((tagName) => {
                                            const tech = techStackOptions.find((t) => t.name === tagName);
                                            const IconComp = tech ? getIcon(tech.icon) : null;
                                            return (
                                                <span
                                                    key={tagName}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm"
                                                >
                                                    {IconComp && <IconComp className="w-4 h-4" style={{ color: tech?.color }} />}
                                                    {tagName}
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleTag(tagName)}
                                                        className="ml-1 hover:text-red-400"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Featured Checkbox */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="w-5 h-5 rounded bg-gray-900/50 border-white/10"
                                />
                                <label htmlFor="featured" className="text-white/70">Featured Project</label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-900 font-semibold rounded-xl hover:from-emerald-400 hover:to-teal-400 transition-all"
                                >
                                    {editingProject ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
