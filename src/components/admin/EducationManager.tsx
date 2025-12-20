"use client";

import { useState, useEffect } from "react";
import {
    MdSchool,
    MdAdd,
    MdEdit,
    MdDelete,
} from "react-icons/md";
import {
    Education,
    CreateEducationInput,
} from "@/types/types";
import { CompanySearchInput } from "./CompanySearchInput";

export function EducationManager() {
    const [educations, setEducations] = useState<Education[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    // Initial form state
    const initialFormState: CreateEducationInput = {
        school: "",
        degree: "",
        fieldOfStudy: "",
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        isCurrent: false,
        grade: "",
        activities: "",
        description: "",
        logoUrl: "",
        order: 0,
        isActive: true,
    };

    const [formData, setFormData] = useState<CreateEducationInput>(initialFormState);

    useEffect(() => {
        fetchEducations();
    }, []);

    const fetchEducations = async () => {
        try {
            const res = await fetch("/api/educations");
            const data = await res.json();
            if (res.ok) {
                setEducations(data);
            }
        } catch (error) {
            console.error("Error fetching educations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (education: Education) => {
        setFormData({
            school: education.school,
            degree: education.degree || "",
            fieldOfStudy: education.fieldOfStudy || "",
            startDate: new Date(education.startDate).toISOString().split('T')[0],
            endDate: education.endDate ? new Date(education.endDate).toISOString().split('T')[0] : "",
            isCurrent: education.isCurrent,
            grade: education.grade || "",
            activities: education.activities || "",
            description: education.description || "",
            logoUrl: education.logoUrl || "",
            order: education.order,
            isActive: education.isActive,
        });
        setIsEditing(education.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this education?")) return;

        try {
            const res = await fetch(`/api/educations/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setEducations(educations.filter(edu => edu.id !== id));
            } else {
                alert("Failed to delete education");
            }
        } catch (error) {
            console.error("Error deleting education:", error);
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
                degree: formData.degree || null,
                fieldOfStudy: formData.fieldOfStudy || null,
                grade: formData.grade || null,
                activities: formData.activities || null,
                description: formData.description || null,
                logoUrl: formData.logoUrl || null,
            };

            const url = isEditing
                ? `/api/educations/${isEditing}`
                : "/api/educations";

            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                await fetchEducations();
                setShowForm(false);
                setFormData(initialFormState);
                setIsEditing(null);
            } else {
                const error = await res.json();
                alert(error.error || "Failed to save education");
            }
        } catch (error) {
            console.error("Error saving education:", error);
            alert("Error saving education");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div>Loading education history...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <MdSchool className="text-purple-600" />
                    Education
                </h2>
                <button
                    onClick={() => {
                        setFormData(initialFormState);
                        setIsEditing(null);
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    <MdAdd size={18} />
                    Add Education
                </button>
            </div>

            {/* Education List */}
            <div className="space-y-4">
                {educations.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">No education history added yet.</p>
                    </div>
                ) : (
                    educations.map((edu) => (
                        <div
                            key={edu.id}
                            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-purple-300 transition-all shadow-sm group"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center shrink-0 border border-purple-100 overflow-hidden">
                                        {edu.logoUrl ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img
                                                src={edu.logoUrl}
                                                alt={edu.school}
                                                className="w-full h-full object-contain p-1"
                                            />
                                        ) : (
                                            <MdSchool className="text-purple-400 text-2xl" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{edu.school}</h3>
                                        <div className="text-purple-700 font-medium">
                                            {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                                        </div>
                                        <div className="text-sm text-gray-500 flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                                            <span>
                                                {new Date(edu.startDate).getFullYear()}
                                                {' - '}
                                                {edu.isCurrent ? 'Present' : edu.endDate ? new Date(edu.endDate).getFullYear() : ''}
                                            </span>
                                            {edu.grade && (
                                                <>
                                                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                                    <span>Grade: {edu.grade}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(edu)}
                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <MdEdit size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(edu.id)}
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
                                {isEditing ? "Edit Education" : "Add Education"}
                            </h3>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* School & Logo */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">School / University *</label>
                                <CompanySearchInput
                                    value={formData.school}
                                    logoUrl={formData.logoUrl || ""}
                                    onCompanyChange={(name, logo) => setFormData({
                                        ...formData,
                                        school: name,
                                        logoUrl: logo
                                    })}
                                    placeholder="Search school (e.g., Harvard, ITB)..."
                                    required
                                />
                                <p className="text-xs text-gray-500">
                                    Search for school to auto-fill the logo, or type manually
                                </p>
                            </div>

                            {/* Degree & Field of Study */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Degree</label>
                                    <input
                                        type="text"
                                        value={formData.degree || ""}
                                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                        placeholder="Ex: Bachelor's, Master's"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Field of Study</label>
                                    <input
                                        type="text"
                                        value={formData.fieldOfStudy || ""}
                                        onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                        placeholder="Ex: Computer Science"
                                    />
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Start Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-gray-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex justify-between">
                                        End Date
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="isCurrentEdu"
                                                checked={formData.isCurrent}
                                                onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                                                className="rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                                            />
                                            <label htmlFor="isCurrentEdu" className="text-xs font-normal text-gray-500 cursor-pointer select-none">Current</label>
                                        </div>
                                    </label>
                                    <input
                                        type="date"
                                        disabled={formData.isCurrent}
                                        value={formData.endDate || ""}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400 text-gray-900"
                                    />
                                </div>
                            </div>

                            {/* Grade & Activities */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Grade / GPA</label>
                                <input
                                    type="text"
                                    value={formData.grade || ""}
                                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                    placeholder="Ex: 3.8/4.0, Cum Laude"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Activities and Societies</label>
                                <textarea
                                    value={formData.activities || ""}
                                    onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all resize-y text-gray-900 placeholder:text-gray-400"
                                    placeholder="Ex: Student Council, Robotics Club..."
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={formData.description || ""}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all resize-y text-gray-900 placeholder:text-gray-400"
                                    placeholder="Describe your studies, major projects, thesis..."
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
                                    className="flex-1 px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? "Saving..." : (isEditing ? "Update Education" : "Add Education")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
