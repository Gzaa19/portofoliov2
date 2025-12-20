// ==========================================
// Admin Components Index
// ==========================================

export { ProjectsManager } from './ProjectsManager';
export { LocationManager } from './LocationManager';
export { SocialLinksManager } from './SocialLinksManager';
export { DashboardManager } from './DashboardManager';
export { ToolboxManager } from './ToolboxManager';
export { ExperienceManager } from './ExperienceManager';

// Re-export types from centralized types file
export type {
    Project,
    Location,
    SocialLink,
    DashboardStats,
    ToolboxCategory,
    ToolboxItem,
} from '@/types/types';
