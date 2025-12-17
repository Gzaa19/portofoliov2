"use client";

import { useState, useEffect } from "react";

interface HeroSettings {
    id: string;
    name: string;
    role: string;
    status: string;
}

const STATUS_OPTIONS = [
    { value: "available", label: "Available", color: "bg-green-500" },
    { value: "busy", label: "Not Available", color: "bg-red-500" },
    { value: "new_project", label: "New Project", color: "bg-yellow-500" },
];

export function HeroManager() {
    const [settings, setSettings] = useState<HeroSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        status: "available",
    });

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/hero");
            const data = await res.json();
            setSettings(data);
            setFormData({
                name: data.name || "",
                role: data.role || "",
                status: data.status || "available",
            });
        } catch (error) {
            console.error("Failed to fetch hero settings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const res = await fetch("/api/hero", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error("Failed to save hero settings:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const option = STATUS_OPTIONS.find((o) => o.value === status);
        return option || STATUS_OPTIONS[0];
    };

    if (isLoading) {
        return (
            <div className="bg-gray-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                <div className="text-center text-white/50">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Hero Settings</h1>
                <p className="text-white/50">Kelola tampilan Hero section</p>
            </div>

            {/* Current Status Preview */}
            <div className="bg-gray-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Preview</h2>
                <div className="bg-gray-900/50 rounded-xl p-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full mb-4">
                        <span className={`w-2 h-2 rounded-full ${getStatusBadge(formData.status).color}`} />
                        <span className="text-sm text-white">
                            {getStatusBadge(formData.status).label}
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                        Hello, I'm {formData.name || "..."}
                    </h3>
                    <p className="text-white/50 mt-2">{formData.role || "..."}</p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-gray-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Display Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50"
                            placeholder="e.g., Gzaaa"
                            required
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Role / Title
                        </label>
                        <input
                            type="text"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50"
                            placeholder="e.g., Full Stack Developer"
                            required
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Availability Status
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            {STATUS_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, status: option.value })}
                                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${formData.status === option.value
                                            ? "bg-emerald-500/20 border-2 border-emerald-500/50"
                                            : "bg-gray-900/50 border border-white/10 hover:bg-gray-800"
                                        }`}
                                >
                                    <span className={`w-3 h-3 rounded-full ${option.color}`} />
                                    <span className={`text-sm ${formData.status === option.value
                                            ? "text-emerald-300"
                                            : "text-white/70"
                                        }`}>
                                        {option.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 text-gray-900 font-semibold rounded-xl hover:from-emerald-400 hover:to-teal-400 transition-all disabled:opacity-50"
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default HeroManager;
