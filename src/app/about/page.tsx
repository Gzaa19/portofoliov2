import { AboutView } from "@/components/about/AboutView";
import { getProfileData, getToolboxCategories, getExperiences } from "@/data";

// Revalidate every 60s, also revalidated on CRUD operations
export const revalidate = 60;

export default async function AboutPage() {
    const [profileData, toolboxCategories, experiences] = await Promise.all([
        getProfileData(),
        getToolboxCategories(),
        getExperiences(),
    ]);

    return (
        <AboutView
            initialData={profileData}
            toolboxCategories={toolboxCategories}
            experiences={experiences}
        />
    );
}
