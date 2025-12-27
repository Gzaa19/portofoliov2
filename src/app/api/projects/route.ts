import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

// GET - Fetch all projects with tags and category
export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
                category: true,
            },
            orderBy: [
                { featured: 'desc' },
                { createdAt: 'desc' },
            ],
        });

        // Transform the data to include tags directly
        const transformedProjects = projects.map((project) => ({
            ...project,
            tags: project.tags.map((pt) => ({
                id: pt.tag.id,
                name: pt.tag.name,
                slug: pt.tag.slug,
                iconName: pt.tag.iconName,
                color: pt.tag.color,
            })),
        }));

        return NextResponse.json(transformedProjects);
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}

// POST - Create new project
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { slug, title, description, link, github, image, featured, tags, categoryId } = body;

        // Validate categoryId if provided
        if (categoryId) {
            const categoryExists = await prisma.projectCategory.findUnique({
                where: { id: categoryId },
            });
            if (!categoryExists) {
                return NextResponse.json(
                    { error: "Invalid category ID" },
                    { status: 400 }
                );
            }
        }

        // Create the project
        const project = await prisma.project.create({
            data: {
                slug,
                title,
                description,
                link: link || null,
                github: github || null,
                image: image || null,
                featured: featured || false,
                categoryId: categoryId || null,
            },
        });

        // Handle tags if provided
        if (tags && Array.isArray(tags) && tags.length > 0) {
            for (const tagData of tags) {
                // Find or create the tag
                let tag = await prisma.tag.findUnique({
                    where: { name: tagData.name },
                });

                if (!tag) {
                    // Create new tag
                    tag = await prisma.tag.create({
                        data: {
                            name: tagData.name,
                            slug: tagData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                            iconName: tagData.iconName || null,
                            color: tagData.color || null,
                        },
                    });
                } else if ((tagData.color && tagData.color !== tag.color) || (tagData.iconName && tagData.iconName !== tag.iconName)) {
                    // Update existing tag color/iconName if different
                    tag = await prisma.tag.update({
                        where: { id: tag.id },
                        data: {
                            color: tagData.color || tag.color,
                            iconName: tagData.iconName || tag.iconName,
                        },
                    });
                }

                // Create the project-tag relation
                await prisma.projectTag.create({
                    data: {
                        projectId: project.id,
                        tagId: tag.id,
                    },
                });
            }
        }

        // Fetch the complete project with tags and category
        const completeProject = await prisma.project.findUnique({
            where: { id: project.id },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
                category: true,
            },
        });

        revalidatePath('/projects');
        revalidatePath('/');

        return NextResponse.json(completeProject, { status: 201 });
    } catch (error) {
        console.error("Failed to create project:", error);
        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 }
        );
    }
}

