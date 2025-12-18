/**
 * Next.js Server Actions Index
 * 
 * File ini mengekspor semua Server Actions yang menggunakan directive "use server".
 * Server Actions ini dapat dipanggil langsung dari Client Components.
 * 
 * Keuntungan menggunakan Server Actions:
 * - Tidak perlu membuat API route terpisah
 * - Type-safe antara client dan server
 * - Automatic revalidation dengan revalidatePath
 * - Progressive enhancement (works without JS)
 * 
 * Usage:
 *   import { updateHeroSettingsAction } from "@/lib/serverActions";
 *   
 *   // Dalam Client Component:
 *   const result = await updateHeroSettingsAction(formData);
 */

// Hero Settings
export {
    getHeroSettingsAction,
    updateHeroSettingsAction,
    type HeroFormData,
} from "./heroServerActions";

// Projects
export {
    getAllProjectsAction,
    createProjectAction,
    updateProjectAction,
    deleteProjectAction,
    type ProjectFormData,
} from "./projectsServerActions";

// About/Profile
export {
    getProfileAction,
    updateProfileAction,
    type ProfileFormData,
} from "./aboutServerActions";

// Social Links
export {
    getAllSocialLinksAction,
    createSocialLinkAction,
    updateSocialLinkAction,
    deleteSocialLinkAction,
    type SocialLinkFormData,
} from "./socialLinksServerActions";

// Location
export {
    getLocationAction,
    getAllLocationsAction,
    createLocationAction,
    updateLocationAction,
    deleteLocationAction,
    type LocationFormData,
} from "./locationServerActions";

// Toolbox
export {
    getToolboxCategoriesAction,
    createCategoryAction,
    updateCategoryAction,
    deleteCategoryAction,
    createItemAction,
    updateItemAction,
    deleteItemAction,
    type CategoryFormData,
    type ItemFormData,
} from "./toolboxServerActions";
