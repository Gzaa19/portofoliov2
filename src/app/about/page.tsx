import { AboutView } from "@/components/about/AboutView";
import { getProfileData, getToolboxCategories } from "@/data";

// Cache for 1 hour to improve performance
export const revalidate = 3600;

export default async function AboutPage() {
    const [profileData, toolboxCategories] = await Promise.all([
        getProfileData(),
        getToolboxCategories(),
    ]);

    return (
        <AboutView
            initialData={profileData}
            toolboxCategories={toolboxCategories}
        />
    );
}
