import { Hero } from "@/sections/Hero";
import { FeaturedProjects } from "@/sections/FeaturedProjects";
import { getHeroSettings, getFeaturedProjects } from "@/data";

export const revalidate = 60;

export default async function Home() {
  const [heroSettings, featuredProjects] = await Promise.all([
    getHeroSettings(),
    getFeaturedProjects(),
  ]);

  return (
    <>
      <Hero
        name={heroSettings.name}
        role={heroSettings.role}
        status={heroSettings.status}
      />
      <FeaturedProjects projects={featuredProjects} />
    </>
  );
}