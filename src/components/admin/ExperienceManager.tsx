"use client";

import { useState, useEffect } from "react";
import {
    MdBusiness,
    MdAdd,
    MdEdit,
    MdDelete,
    MdDateRange,
    MdLocationOn,
    MdWork,
    MdDragIndicator
} from "react-icons/md";
import {
    Experience,
    CreateExperienceInput,
    EMPLOYMENT_TYPE_LABELS,
    LOCATION_TYPE_LABELS,
    EmploymentType,
    LocationType
} from "@/types/types";
import Image from "next/image";

export function ExperienceManager() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    // Initial form state
    const initialFormState: CreateExperienceInput = {
        companyName: "",
        companyLogo: "",
        companyUrl: "",
        title: "",
        employmentType: "full_time",
        location: "",
        locationType: "on_site",
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        isCurrent: false,
        description: "",
        order: 0,
        isActive: true,
        skills: []
    };

    const [formData, setFormData] = useState<CreateExperienceInput>(initialFormState);
    const [currentSkill, setCurrentSkill] = useState("");

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const res = await fetch("/api/experiences");
            const data = await res.json();
            if (res.ok) {
                setExperiences(data);
            }
        } catch (error) {
            console.error("Error fetching experiences:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (experience: Experience) => {
        setFormData({
            companyName: experience.companyName,
            companyLogo: experience.companyLogo || "",
            companyUrl: experience.companyUrl || "",
            title: experience.title,
            employmentType: experience.employmentType,
            location: experience.location || "",
            locationType: experience.locationType,
            startDate: new Date(experience.startDate).toISOString().split('T')[0],
            endDate: experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : "",
            isCurrent: experience.isCurrent,
            description: experience.description || "",
            order: experience.order,
            isActive: experience.isActive,
            skills: experience.skills
        });
        setIsEditing(experience.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this experience?")) return;

        try {
            const res = await fetch(`/api/experiences/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setExperiences(experiences.filter(exp => exp.id !== id));
            } else {
                alert("Failed to delete experience");
            }
        } catch (error) {
            console.error("Error deleting experience:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Prepare payload
            const payload = {
                ...formData,
                // Ensure dates are properly formatted or null
                endDate: formData.isCurrent ? null : (formData.endDate || null),
                companyLogo: formData.companyLogo || null,
                companyUrl: formData.companyUrl || null,
                location: formData.location || null,
                description: formData.description || null,
            };

            const url = isEditing
                ? `/api/experiences/${isEditing}`
                : "/api/experiences";

            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                await fetchExperiences();
                setShowForm(false);
                setFormData(initialFormState);
                setIsEditing(null);
            } else {
                const error = await res.json();
                alert(error.error || "Failed to save experience");
            }
        } catch (error) {
            console.error("Error saving experience:", error);
            alert("Error saving experience");
        } finally {
            setIsSubmitting(false);
        }
    };

    const addSkill = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && currentSkill.trim()) {
            e.preventDefault();
            if (!formData.skills?.includes(currentSkill.trim())) {
                setFormData({
                    ...formData,
                    skills: [...(formData.skills || []), currentSkill.trim()]
                });
                setCurrentSkill("");
            }
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData({
            ...formData,
            skills: formData.skills?.filter(skill => skill !== skillToRemove)
        });
    };

    if (isLoading) return <div>Loading experiences...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <MdBusiness className="text-blue-600" />
                    Work Experience
                </h2>
                <button
                    onClick={() => {
                        setFormData(initialFormState);
                        setIsEditing(null);
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    <MdAdd size={18} />
                    Add Experience
                </button>
            </div>

            {/* Experience List */}
            <div className="space-y-4">
                {experiences.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">No work experience added yet.</p>
                    </div>
                ) : (
                    experiences.map((exp) => (
                        <div
                            key={exp.id}
                            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all shadow-sm group"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden">
                                        {exp.companyLogo ? (
                                            <Image
                                                src={exp.companyLogo}
                                                alt={exp.companyName}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <MdBusiness className="text-gray-400 text-2xl" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{exp.title}</h3>
                                        <div className="text-gray-700 font-medium">{exp.companyName}</div>
                                        <div className="text-sm text-gray-500 flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                                            <span>
                                                {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                {' - '}
                                                {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ''}
                                            </span>
                                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                            <span>{LOCATION_TYPE_LABELS[exp.locationType]}</span>
                                            {exp.location && (
                                                <>
                                                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                                    <span>{exp.location}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(exp)}
                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <MdEdit size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(exp.id)}
                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <MdDelete size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Edit/Create Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                            <h3 className="text-xl font-bold text-gray-900">
                                {isEditing ? "Edit Experience" : "Add Experience"}
                            </h3>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Job Title *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Ex: Senior Frontend Developer"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Employment Type *</label>
                                    <select
                                        required
                                        value={formData.employmentType}
                                        onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as EmploymentType })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
                                    >
                                        {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Company Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Ex: Google"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Company Logo URL (Optional)</label>
                                    <input
                                        type="url"
                                        value={formData.companyLogo || ""}
                                        onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Location (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.location || ""}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Ex: Jakarta, Indonesia"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Location Type</label>
                                    <select
                                        value={formData.locationType}
                                        onChange={(e) => setFormData({ ...formData, locationType: e.target.value as LocationType })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
                                    >
                                        {Object.entries(LOCATION_TYPE_LABELS).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Start Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex justify-between">
                                        End Date
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="isCurrent"
                                                checked={formData.isCurrent}
                                                onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                                                className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            />
                                            <label htmlFor="isCurrent" className="text-xs font-normal text-gray-500 cursor-pointer select-none">I currently work here</label>
                                        </div>
                                    </label>
                                    <input
                                        type="date"
                                        disabled={formData.isCurrent}
                                        value={formData.endDate || ""}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Skills Used</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {formData.skills?.map((skill, idx) => (
                                        <div key={idx} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill)}
                                                className="hover:text-blue-900 transition-colors"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={currentSkill}
                                    onChange={(e) => setCurrentSkill(e.target.value)}
                                    onKeyDown={addSkill}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Type a skill and press Enter..."
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={formData.description || ""}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-y"
                                    placeholder="Describe your role, responsibilities, and achievements..."
                                />
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? "Saving..." : (isEditing ? "Update Experience" : "Add Experience")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
