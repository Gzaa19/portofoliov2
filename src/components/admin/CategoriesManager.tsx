"use client";

import { useState } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdCheck } from "react-icons/md";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    iconName: string | null;
    order: number;
    isActive: boolean;
    _count?: { projects: number };
}

interface CategoriesManagerProps {
    initialCategories: Category[];
}

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        color: "#3B82F6",
        order: 0,
        isActive: true,
    });

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/project-categories", { cache: "no-store" });
            if (!res.ok) throw new Error("Failed to fetch categories");
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            setCategories([]);
        } finally {
            setIsLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingCategory(null);
        setFormData({
            name: "",
            description: "",
            color: "#3B82F6",
            order: categories.length,
            isActive: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || "",
            color: category.color || "#3B82F6",
            order: category.order,
            isActive: category.isActive,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
        };

        try {
            if (editingCategory) {
                await fetch(`/api/project-categories/${editingCategory.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            } else {
                await fetch("/api/project-categories", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }

            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error("Failed to save category:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus category ini?")) return;

        try {
            const res = await fetch(`/api/project-categories/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const data = await res.json();
                alert(data.error || "Gagal menghapus category");
                return;
            }
            fetchCategories();
        } catch (error) {
            console.error("Failed to delete category:", error);
        }
    };

    const toggleActive = async (category: Category) => {
        try {
            await fetch(`/api/project-categories/${category.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !category.isActive }),
            });
            fetchCategories();
        } catch (error) {
            console.error("Failed to toggle category status:", error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
                    <p className="text-gray-500">Kelola kategori project</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25"
                >
                    <span className="flex items-center gap-2">
                        <MdAdd size={20} />
                        Add Category
                    </span>
                </button>
            </div>

            {/* Categories List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : categories.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Belum ada category</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Color</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Projects</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Order</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                                <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-gray-900 font-medium">{category.name}</div>
                                        <div className="text-gray-500 text-sm">{category.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-6 h-6 rounded-full border border-gray-200"
                                                style={{ backgroundColor: category.color || "#3B82F6" }}
                                            />
                                            <span className="text-gray-600 text-sm">{category.color}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                                            {category._count?.projects ?? 0} projects
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-600">{category.order}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleActive(category)}
                                            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${category.isActive
                                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                }`}
                                        >
                                            {category.isActive ? (
                                                <span className="flex items-center gap-1">
                                                    <MdCheck size={14} /> Active
                                                </span>
                                            ) : (
                                                "Inactive"
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(category)}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                            >
                                                <span className="flex items-center gap-1">
                                                    <MdEdit size={16} /> Edit
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="text-red-600 hover:text-red-800 font-medium text-sm"
                                            >
                                                <span className="flex items-center gap-1">
                                                    <MdDelete size={16} /> Delete
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg mx-4 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingCategory ? "Edit Category" : "Add Category"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <MdClose size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    placeholder="e.g. Web Development"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 h-20 resize-none"
                                    placeholder="Optional description..."
                                />
                            </div>

                            {/* Color */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="#3B82F6"
                                    />
                                </div>
                            </div>

                            {/* Order */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    min={0}
                                />
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                                    Active (visible on frontend)
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25"
                                >
                                    {editingCategory ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
