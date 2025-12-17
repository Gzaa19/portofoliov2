// ==========================================
// Actions Index - Export semua actions
// ==========================================

// Projects
export {
    projectsReducer,
    projectsActions,
    initialProjectsState,
    initialProjectFormData,
} from "./projectsActions";
export type {
    ProjectsState,
    ProjectsAction,
    ProjectFormData,
} from "./projectsActions";

// Social Links
export {
    socialLinksReducer,
    socialLinksActions,
    initialSocialLinksState,
    initialSocialLinkFormData,
} from "./socialLinksActions";
export type {
    SocialLinksState,
    SocialLinksAction,
    SocialLinkFormData,
} from "./socialLinksActions";

// Location
export {
    locationReducer,
    locationActions,
    initialLocationState,
    initialLocationFormData,
} from "./locationActions";
export type {
    LocationState,
    LocationAction,
    LocationFormData,
    GeocodingResult,
} from "./locationActions";

// Toolbox
export {
    toolboxReducer,
    toolboxActions,
    initialToolboxState,
    initialCategoryFormData,
    initialItemFormData,
} from "./toolboxActions";
export type {
    ToolboxState,
    ToolboxAction,
    CategoryFormData,
    ItemFormData,
} from "./toolboxActions";

// Hero
export {
    heroReducer,
    heroActions,
    initialHeroState,
    initialHeroFormData,
} from "./heroActions";
export type {
    HeroState,
    HeroAction,
    HeroFormData,
} from "./heroActions";
