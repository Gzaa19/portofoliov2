// ==========================================
// Centralized Types - Semua interface ada di sini
// ==========================================

// ==========================================
// Project Types
// ==========================================
export interface Project {
    id: string;
    slug: string;
    title: string;
    description: string;
    link?: string | null;
    github?: string | null;
    image?: string | null;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
    tags: ProjectTag[];
}

export interface ProjectTag {
    id: string;
    name: string;
    slug: string;
    iconName?: string | null;
    color?: string | null;
}

export interface CreateProjectInput {
    slug: string;
    title: string;
    description: string;
    link?: string;
    github?: string;
    image?: string;
    featured?: boolean;
    tags: string[];
}

export interface UpdateProjectInput {
    slug?: string;
    title?: string;
    description?: string;
    link?: string | null;
    github?: string | null;
    image?: string | null;
    featured?: boolean;
    tags?: string[];
}

// ==========================================
// Tag Types
// ==========================================
export interface Tag {
    id: string;
    name: string;
    slug: string;
    iconName?: string | null;
    color?: string | null;
}

// ==========================================
// Social Link Types
// ==========================================
export interface SocialLink {
    id: string;
    name: string;
    username: string;
    description?: string | null;
    url: string;
    iconName: string;
    iconBg?: string | null;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateSocialLinkInput {
    name: string;
    username: string;
    description?: string;
    url: string;
    iconName: string;
    iconBg?: string;
    isActive?: boolean;
}

export interface UpdateSocialLinkInput {
    name?: string;
    username?: string;
    description?: string | null;
    url?: string;
    iconName?: string;
    iconBg?: string | null;
    isActive?: boolean;
}

// ==========================================
// Location Types
// ==========================================
export interface Location {
    id: string;
    name: string;
    address?: string | null;
    latitude: number;
    longitude: number;
    zoom: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// ==========================================
// Toolbox Types
// ==========================================
export interface ToolboxItem {
    id: string;
    name: string;
    iconName: string;
    color: string;
    order: number;
    isActive: boolean;
    categoryId: string;
}

export interface ToolboxCategory {
    id: string;
    name: string;
    order: number;
    isActive: boolean;
    items: ToolboxItem[];
}

// ==========================================
// Hero Settings Types
// ==========================================
export interface HeroSettings {
    id: string;
    name: string;
    role: string;
    status: "available" | "busy" | "new_project";
    isActive: boolean;
}

// ==========================================
// Profile Types
// ==========================================
export interface Profile {
    id: string;
    description: string;
    photoUrl: string;
    resumeUrl: string;
    isActive: boolean;
}

// ==========================================
// Dashboard Types
// ==========================================
export interface DashboardStats {
    projects: number;
    tags: number;
    socialLinks: number;
    hasLocation: boolean;
    locationName?: string;
    totalProjects?: number;
    totalSocialLinks?: number;
    totalToolboxItems?: number;
    featuredProjects?: number;
}

// ==========================================
// Animation Types
// ==========================================
export type AnimationType =
    | "fade-up"
    | "fade-in"
    | "scale-up"
    | "slide-left"
    | "slide-right"
    | "stagger";

export interface GsapOptions {
    type?: AnimationType;
    duration?: number;
    delay?: number;
    ease?: string;
    triggerStart?: string;
    staggerAmount?: number;
}

// ==========================================
// UI Component Types
// ==========================================
export interface NavItem {
    label: string;
    href: string;
}

export interface PillNavProps {
    items: NavItem[];
    className?: string;
}

// ==========================================
// Experience Types (LinkedIn-style)
// ==========================================
export type EmploymentType =
    | "full_time"
    | "part_time"
    | "self_employed"
    | "freelance"
    | "contract"
    | "internship"
    | "apprenticeship"
    | "seasonal";

export type LocationType = "on_site" | "hybrid" | "remote";

export interface Experience {
    id: string;
    companyName: string;
    companyLogo?: string | null;
    companyUrl?: string | null;
    title: string;
    employmentType: EmploymentType;
    location?: string | null;
    locationType: LocationType;
    startDate: Date | string;
    endDate?: Date | string | null;
    isCurrent: boolean;
    description?: string | null;
    order: number;
    isActive: boolean;
    skills: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateExperienceInput {
    companyName: string;
    companyLogo?: string;
    companyUrl?: string;
    title: string;
    employmentType: EmploymentType;
    location?: string;
    locationType?: LocationType;
    startDate: string; // ISO date string
    endDate?: string; // ISO date string
    isCurrent?: boolean;
    description?: string;
    order?: number;
    isActive?: boolean;
    skills?: string[];
}

export interface UpdateExperienceInput {
    companyName?: string;
    companyLogo?: string | null;
    companyUrl?: string | null;
    title?: string;
    employmentType?: EmploymentType;
    location?: string | null;
    locationType?: LocationType;
    startDate?: string;
    endDate?: string | null;
    isCurrent?: boolean;
    description?: string | null;
    order?: number;
    isActive?: boolean;
    skills?: string[];
}

// Employment type display labels
export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
    full_time: "Full-time",
    part_time: "Part-time",
    self_employed: "Self-employed",
    freelance: "Freelance",
    contract: "Contract",
    internship: "Internship",
    apprenticeship: "Apprenticeship",
    seasonal: "Seasonal",
};

// Location type display labels
export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
    on_site: "On-site",
    hybrid: "Hybrid",
    remote: "Remote",
};

