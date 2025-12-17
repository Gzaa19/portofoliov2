"use client";

import { useState, useMemo } from "react";
import * as SiIcons from "react-icons/si";
import { IconType } from "react-icons";
import { techStackOptions } from "@/lib/techStackOptions";
import { MdSearch, MdClose } from "react-icons/md";
import type { ToolboxItem, ToolboxCategory } from "@/types/types";

interface ToolboxManagerProps {
    initialCategories: ToolboxCategory[];
}

// Get all Si icon names from the library
const allSiIconNames = Object.keys(SiIcons).filter(key => key.startsWith('Si'));

export function ToolboxManager({ initialCategories }: ToolboxManagerProps) {
    const [categories, setCategories] = useState<ToolboxCategory[]>(initialCategories);
    const [isLoading, setIsLoading] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ToolboxCategory | null>(null);
    const [editingItem, setEditingItem] = useState<ToolboxItem | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [categoryForm, setCategoryForm] = useState({ name: "", order: 0 });
    const [itemForm, setItemForm] = useState({ name: "", iconName: "", color: "#FFFFFF", order: 0, categoryId: "" });
    const [iconSearch, setIconSearch] = useState("");
    const [showIconSearch, setShowIconSearch] = useState(false);

    const getIcon = (iconName: string): IconType | null => {
        const icons = SiIcons as Record<string, IconType>;
        return icons[iconName] || null;
    };

    // Filter icons based on search query
    const filteredIcons = useMemo(() => {
        if (!iconSearch.trim()) return [];
        const query = iconSearch.toLowerCase();
        return allSiIconNames
            .filter(name => name.toLowerCase().includes(query))
            .slice(0, 50); // Limit to 50 results for performance
    }, [iconSearch]);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/toolbox", { cache: 'no-store' });
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Category CRUD
    const openAddCategory = () => {
        setEditingCategory(null);
        setCategoryForm({ name: "", order: categories.length });
        setIsCategoryModalOpen(true);
    };

    const openEditCategory = (cat: ToolboxCategory) => {
        setEditingCategory(cat);
        setCategoryForm({ name: cat.name, order: cat.order });
        setIsCategoryModalOpen(true);
    };

    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await fetch(`/api/toolbox/${editingCategory.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(categoryForm) });
            } else {
                await fetch("/api/toolbox", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(categoryForm) });
            }
            setIsCategoryModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error("Failed to save:", error);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Yakin hapus kategori ini? Semua item di dalamnya juga akan dihapus.")) return;
        try {
            await fetch(`/api/toolbox/${id}`, { method: "DELETE" });
            fetchCategories();
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    // Item CRUD
    const openAddItem = (categoryId: string) => {
        setEditingItem(null);
        setSelectedCategoryId(categoryId);
        const cat = categories.find(c => c.id === categoryId);
        setItemForm({ name: "", iconName: "", color: "#FFFFFF", order: cat?.items.length || 0, categoryId });
        setIconSearch("");
        setShowIconSearch(false);
        setIsItemModalOpen(true);
    };

    const openEditItem = (item: ToolboxItem) => {
        setEditingItem(item);
        setSelectedCategoryId(item.categoryId);
        setItemForm({ name: item.name, iconName: item.iconName, color: item.color, order: item.order, categoryId: item.categoryId });
        setIconSearch("");
        setShowIconSearch(false);
        setIsItemModalOpen(true);
    };

    const handleItemSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await fetch(`/api/toolbox/items/${editingItem.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(itemForm) });
            } else {
                await fetch("/api/toolbox/items", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(itemForm) });
            }
            setIsItemModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error("Failed to save:", error);
        }
    };

    const handleDeleteItem = async (id: string) => {
        if (!confirm("Yakin hapus item ini?")) return;
        try {
            await fetch(`/api/toolbox/items/${id}`, { method: "DELETE" });
            fetchCategories();
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    const selectTechStack = (tech: typeof techStackOptions[0]) => {
        setItemForm({ ...itemForm, name: tech.name, iconName: tech.icon, color: tech.color });
        setShowIconSearch(false);
        setIconSearch("");
    };

    const selectSearchedIcon = (iconName: string) => {
        // Try to extract a readable name from the icon name (e.g., SiReact -> React)
        const readableName = iconName.replace(/^Si/, '').replace(/([A-Z])/g, ' $1').trim();
        setItemForm({ ...itemForm, iconName, name: itemForm.name || readableName });
        setIconSearch("");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Toolbox</h1>
                    <p className="text-white/50">Kelola tech stack yang ditampilkan di About page</p>
                </div>
                <button onClick={openAddCategory} className="px-4 py-2 bg-linear-to-r from-emerald-500 to-teal-500 text-gray-900 font-semibold rounded-xl hover:from-emerald-400 hover:to-teal-400 transition-all">+ Add Category</button>
            </div>

            {isLoading ? (
                <div className="text-center text-white/50 py-8">Loading...</div>
            ) : categories.length === 0 ? (
                <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-12 text-center">
                    <div className="text-6xl mb-4">🧰</div>
                    <h3 className="text-xl font-bold text-white mb-2">Belum ada kategori</h3>
                    <p className="text-white/50 mb-6">Tambahkan kategori untuk mulai mengatur toolbox</p>
                    <button onClick={openAddCategory} className="px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 text-gray-900 font-semibold rounded-xl">+ Add Category</button>
                </div>
            ) : (
                <div className="space-y-6">
                    {categories.map((cat) => (
                        <div key={cat.id} className="bg-gray-800/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
                            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-white/30 text-sm">#{cat.order + 1}</span>
                                    <h3 className="text-lg font-semibold text-white">{cat.name}</h3>
                                    <span className="px-2 py-0.5 text-xs bg-white/10 rounded-full text-white/50">{cat.items.length} items</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openAddItem(cat.id)} className="px-3 py-1.5 text-sm bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors">+ Item</button>
                                    <button onClick={() => openEditCategory(cat)} className="px-3 py-1.5 text-sm text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">Edit</button>
                                    <button onClick={() => handleDeleteCategory(cat.id)} className="px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">Delete</button>
                                </div>
                            </div>
                            <div className="p-4">
                                {cat.items.length === 0 ? (
                                    <p className="text-white/30 text-sm text-center py-4">Belum ada item</p>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                        {cat.items.map((item) => {
                                            const IconComp = getIcon(item.iconName);
                                            return (
                                                <div key={item.id} className="group relative bg-gray-900/50 rounded-xl p-4 flex flex-col items-center gap-2 border border-white/5 hover:border-white/20 transition-colors">
                                                    {IconComp && <IconComp className="w-8 h-8" style={{ color: item.color }} />}
                                                    <span className="text-white/70 text-sm text-center truncate w-full">{item.name}</span>
                                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                        <button onClick={() => openEditItem(item)} className="p-1 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/30">✏️</button>
                                                        <button onClick={() => handleDeleteItem(item.id)} className="p-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30">🗑️</button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Category Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 border border-white/10 rounded-2xl w-full max-w-md">
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">{editingCategory ? "Edit Category" : "Add Category"}</h2>
                        </div>
                        <form onSubmit={handleCategorySubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Category Name</label>
                                <input type="text" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} className="w-full px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50" placeholder="Programming Languages" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Order</label>
                                <input type="number" value={categoryForm.order} onChange={(e) => setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50" />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 text-white/70 hover:text-white transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-linear-to-r from-emerald-500 to-teal-500 text-gray-900 font-semibold rounded-xl">{editingCategory ? "Update" : "Create"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Item Modal */}
            {isItemModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">{editingItem ? "Edit Item" : "Add Item"}</h2>
                        </div>
                        <form onSubmit={handleItemSubmit} className="p-6 space-y-4">
                            {/* Tab Toggle */}
                            <div className="flex gap-2 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setShowIconSearch(false)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!showIconSearch ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-gray-900/50 text-white/50 border border-transparent hover:bg-gray-800'}`}
                                >
                                    Quick Select
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowIconSearch(true)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${showIconSearch ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-gray-900/50 text-white/50 border border-transparent hover:bg-gray-800'}`}
                                >
                                    <MdSearch /> Search All Icons
                                </button>
                            </div>

                            {/* Quick Select from Tech Stack */}
                            {!showIconSearch && (
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Quick Select</label>
                                    <div className="bg-gray-900/50 border border-white/10 rounded-xl p-3 max-h-48 overflow-y-auto">
                                        <div className="grid grid-cols-4 gap-2">
                                            {techStackOptions.map((tech) => {
                                                const IconComp = getIcon(tech.icon);
                                                const isSelected = itemForm.iconName === tech.icon;
                                                return (
                                                    <button key={tech.slug} type="button" onClick={() => selectTechStack(tech)} className={`flex items-center gap-2 p-2 rounded-lg transition-all ${isSelected ? "bg-emerald-500/20 border border-emerald-500/50" : "bg-gray-800/50 border border-transparent hover:bg-gray-700/50"}`}>
                                                        {IconComp && <IconComp className="w-4 h-4 shrink-0" style={{ color: tech.color }} />}
                                                        <span className={`text-xs truncate ${isSelected ? "text-emerald-300" : "text-white/70"}`}>{tech.name}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Icon Search */}
                            {showIconSearch && (
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Search Icons ({allSiIconNames.length} available)</label>
                                    <div className="relative mb-3">
                                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
                                        <input
                                            type="text"
                                            value={iconSearch}
                                            onChange={(e) => setIconSearch(e.target.value)}
                                            className="w-full pl-10 pr-10 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50"
                                            placeholder="Type to search... (e.g., 'flutter', 'aws', 'docker')"
                                        />
                                        {iconSearch && (
                                            <button
                                                type="button"
                                                onClick={() => setIconSearch("")}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                                            >
                                                <MdClose />
                                            </button>
                                        )}
                                    </div>
                                    <div className="bg-gray-900/50 border border-white/10 rounded-xl p-3 min-h-[120px] max-h-48 overflow-y-auto">
                                        {iconSearch.length === 0 ? (
                                            <p className="text-white/30 text-sm text-center py-8">Ketik nama icon untuk mencari...</p>
                                        ) : filteredIcons.length === 0 ? (
                                            <p className="text-white/30 text-sm text-center py-8">Tidak ditemukan icon &quot;{iconSearch}&quot;</p>
                                        ) : (
                                            <div className="grid grid-cols-4 gap-2">
                                                {filteredIcons.map((iconName) => {
                                                    const IconComp = getIcon(iconName);
                                                    const isSelected = itemForm.iconName === iconName;
                                                    return (
                                                        <button
                                                            key={iconName}
                                                            type="button"
                                                            onClick={() => selectSearchedIcon(iconName)}
                                                            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${isSelected ? "bg-emerald-500/20 border border-emerald-500/50" : "bg-gray-800/50 border border-transparent hover:bg-gray-700/50"}`}
                                                        >
                                                            {IconComp && <IconComp className="w-6 h-6" style={{ color: itemForm.color }} />}
                                                            <span className={`text-[10px] truncate w-full text-center ${isSelected ? "text-emerald-300" : "text-white/50"}`}>{iconName.replace('Si', '')}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        {filteredIcons.length === 50 && (
                                            <p className="text-white/30 text-xs text-center mt-2">Showing first 50 results. Type more to narrow down.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Name</label>
                                    <input type="text" value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} className="w-full px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50" placeholder="React" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Icon Name</label>
                                    <input type="text" value={itemForm.iconName} onChange={(e) => setItemForm({ ...itemForm, iconName: e.target.value })} className="w-full px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50" placeholder="SiReact" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Color</label>
                                    <div className="flex gap-2">
                                        <input type="color" value={itemForm.color} onChange={(e) => setItemForm({ ...itemForm, color: e.target.value })} className="w-12 h-10 rounded-lg cursor-pointer bg-transparent border-0" />
                                        <input type="text" value={itemForm.color} onChange={(e) => setItemForm({ ...itemForm, color: e.target.value })} className="flex-1 px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500/50" placeholder="#61DAFB" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Order</label>
                                    <input type="number" value={itemForm.order} onChange={(e) => setItemForm({ ...itemForm, order: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50" />
                                </div>
                            </div>
                            {/* Preview */}
                            {itemForm.iconName && (
                                <div className="bg-gray-900/50 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                                    <span className="text-white/50 text-sm">Preview:</span>
                                    {(() => { const IconComp = getIcon(itemForm.iconName); return IconComp ? <IconComp className="w-8 h-8" style={{ color: itemForm.color }} /> : <span className="text-red-400 text-sm">Icon not found</span>; })()}
                                    <span className="text-white">{itemForm.name}</span>
                                </div>
                            )}
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsItemModalOpen(false)} className="px-4 py-2 text-white/70 hover:text-white transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-linear-to-r from-emerald-500 to-teal-500 text-gray-900 font-semibold rounded-xl">{editingItem ? "Update" : "Create"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

