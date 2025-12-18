"use client";

import { useState, useEffect, useTransition } from "react";
import {
    getHeroSettingsAction,
    updateHeroSettingsAction,
    type HeroFormData,
} from "@/lib/serverActions";

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
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState<HeroFormData>({
        name: "",
        role: "",
        status: "available",
    });

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const result = await getHeroSettingsAction();
            if (result.success && result.data) {
                setSettings(result.data);
                setFormData({
                    name: result.data.name || "",
                    role: result.data.role || "",
                    status: (result.data.status as HeroFormData["status"]) || "available",
                });
            }
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

        startTransition(async () => {
            try {
                const result = await updateHeroSettingsAction(formData);
                if (result.success && result.data) {
                    setSettings(result.data);
                }
            } catch (error) {
                console.error("Failed to save hero settings:", error);
            }
        });
    };

    const getStatusBadge = (status: string) => {
        const option = STATUS_OPTIONS.find((o) => o.value === status);
        return option || STATUS_OPTIONS[0];
    };

    if (isLoading) {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                <div className="text-center text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Hero Settings</h1>
                <p className="text-gray-500">Kelola tampilan Hero section</p>
            </div>

            {/* Current Status Preview */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
                <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full mb-4 shadow-sm">
                        <span className={`w-2 h-2 rounded-full ${getStatusBadge(formData.status).color}`} />
                        <span className="text-sm text-gray-700">
                            {getStatusBadge(formData.status).label}
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                        Hello, I'm {formData.name || "..."}
                    </h3>
                    <p className="text-gray-500 mt-2">{formData.role || "..."}</p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Display Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            placeholder="e.g., Gzaaa"
                            required
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role / Title
                        </label>
                        <input
                            type="text"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            placeholder="e.g., Full Stack Developer"
                            required
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Availability Status
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            {STATUS_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, status: option.value as HeroFormData["status"] })}
                                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${formData.status === option.value
                                        ? "bg-blue-50 border-2 border-blue-500"
                                        : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                                        }`}
                                >
                                    <span className={`w-3 h-3 rounded-full ${option.color}`} />
                                    <span className={`text-sm ${formData.status === option.value
                                        ? "text-blue-600 font-medium"
                                        : "text-gray-600"
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
                            disabled={isPending}
                            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/25"
                        >
                            {isPending ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default HeroManager;
