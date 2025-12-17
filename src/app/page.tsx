import { Hero } from "@/sections/Hero";
import { FeaturedProjects } from "@/sections/FeaturedProjects";
import prisma from "@/lib/prisma";

// Fetch hero settings from database
async function getHeroSettings() {
  try {
    let heroSettings = await prisma.heroSettings.findFirst({
      where: { isActive: true },
    });

    // If no settings exist, return defaults
    if (!heroSettings) {
      return {
        name: "Gzaaa",
        role: "Full Stack Developer",
        status: "busy" as const,
      };
    }

    return {
      name: heroSettings.name,
      role: heroSettings.role,
      status: heroSettings.status as "available" | "busy" | "new_project",
    };
  } catch (error) {
    console.error("Error fetching hero settings:", error);
    return {
      name: "Gzaaa",
      role: "Full Stack Developer",
      status: "busy" as const,
    };
  }
}

// Fetch featured projects from database
async function getFeaturedProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        featured: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6, // Limit to 6 featured projects
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return projects.map((project) => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      description: project.description,
      image: project.image,
      link: project.link,
      github: project.github,
    }));
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return [];
  }
}

export const revalidate = 3600; // Revalidate every hour

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