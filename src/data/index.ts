/**
 * Data Access Layer (DAL) - Index
 * 
 * This file re-exports all data access functions for easy importing.
 * 
 * Usage in Server Components:
 *   import { getHeroSettings, getFeaturedProjects } from "@/data";
 * 
 * Note: These functions should ONLY be called from Server Components.
 * For Client Components, use Server Actions from @/actions or
 * client-side hooks from @/hooks.
 */

// Hero data
export { getHeroSettings } from "./heroData";
export type { HeroSettings, HeroStatus } from "./heroData";

// Projects data
export { getFeaturedProjects, getAllProjects, getProjectBySlug } from "./projectsData";
export type { FeaturedProject, ProjectWithTags, ProjectTag } from "./projectsData";

// Profile data
export { getProfile, getProfileData } from "./profileData";
export type { Profile, ProfileData } from "./profileData";

// Toolbox data
export { getToolboxCategories } from "./toolboxData";
// Re-export from types for consistency
export type { ToolboxCategory, ToolboxItem } from "@/types/types";

// Social links data
export { getSocialLinks } from "./socialLinksData";
export type { SocialLink } from "./socialLinksData";

// Experience data
export { getExperiences } from "./experienceData";

