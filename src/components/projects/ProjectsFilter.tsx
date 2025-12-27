"use client";

import { useState } from "react";
import { ProjectWithTags, ProjectCategoryData } from "@/data";
import { ProjectsGrid } from "./ProjectsGrid";
import { motion } from "framer-motion";

interface ProjectsFilterProps {
    projects: ProjectWithTags[];
    categories: ProjectCategoryData[];
}

export function ProjectsFilter({ projects, categories }: ProjectsFilterProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    // Filter projects based on selected category
    const filteredProjects = selectedCategory === "all"
        ? projects
        : projects.filter(project => project.category?.slug === selectedCategory);

    // Filter categories to only show those that have projects
    const activeCategories = categories.filter(category => category.projectCount && category.projectCount > 0);

    return (
        <div className="space-y-8">
            {/* Category Tabs */}
            {activeCategories.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === "all"
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105"
                            : "bg-white/50 dark:bg-slate-800/50 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 hover:text-gray-900 border border-transparent"
                            }`}
                    >
                        All
                    </button>
                    {activeCategories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.slug)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category.slug
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105"
                                : "bg-white/50 dark:bg-slate-800/50 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 hover:text-gray-900 border border-transparent"
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Filtered Grid */}
            <motion.div
                layout
                className="pointer-events-auto"
            >
                <ProjectsGrid projects={filteredProjects} />
            </motion.div>
        </div>
    );
}
