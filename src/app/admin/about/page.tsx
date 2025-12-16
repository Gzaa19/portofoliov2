"use client";

import { useState, useEffect } from "react";
import { MdSave, MdPerson, MdDescription } from "react-icons/md";
import { FileDropzone } from "@/components/admin/FileDropzone";

export default function AdminAboutPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        description: "",
        photoUrl: "",
        resumeUrl: ""
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/about");
            const data = await res.json();
            if (res.ok && data) {
                setFormData({
                    description: data.description || "",
                    photoUrl: data.photoUrl || "",
                    resumeUrl: data.resumeUrl || ""
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch("/api/about", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert("Profile updated successfully!");
            } else {
                alert("Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error updating profile.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="text-white">Loading profile data...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <MdPerson className="text-emerald-400" />
                    Edit About Me
                </h1>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <MdDescription /> Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={6}
                            className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-gray-600 resize-none"
                            placeholder="Write something about yourself..."
                        />
                    </div>

                    {/* Photo Upload */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FileDropzone
                            accept="image"
                            value={formData.photoUrl}
                            onChange={(url) => setFormData({ ...formData, photoUrl: url })}
                            folder="portfolio/about"
                            label="Profile Photo"
                        />

                        {/* Resume PDF Upload */}
                        <FileDropzone
                            accept="pdf"
                            value={formData.resumeUrl}
                            onChange={(url) => setFormData({ ...formData, resumeUrl: url })}
                            folder="portfolio/resume"
                            label="Resume PDF"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            <MdSave size={20} />
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

