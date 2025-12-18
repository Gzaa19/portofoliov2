import { AboutView } from "@/components/about/AboutView";
import { getProfileData, getToolboxCategories } from "@/data";

// Revalidate every 60s, also revalidated on CRUD operations
export const revalidate = 60;

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
