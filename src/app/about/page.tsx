import { AboutView } from "@/components/about/AboutView";
import { getProfileData, getToolboxCategories, getExperiences, getEducations } from "@/data";

// Revalidate every 60s, also revalidated on CRUD operations
export const revalidate = 60;

export default async function AboutPage() {
    const [profileData, toolboxCategories, experiences, educations] = await Promise.all([
        getProfileData(),
        getToolboxCategories(),
        getExperiences(),
        getEducations(),
    ]);

    return (
        <AboutView
            initialData={profileData}
            toolboxCategories={toolboxCategories}
            experiences={experiences}
            educations={educations}
        />
    );
}
