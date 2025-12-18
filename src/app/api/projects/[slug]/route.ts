import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

// GET - Fetch a single project by slug
export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const project = await prisma.project.findUnique({
            where: { slug },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        // Transform the data
        const transformedProject = {
            ...project,
            tags: project.tags.map((pt) => ({
                id: pt.tag.id,
                name: pt.tag.name,
                slug: pt.tag.slug,
                iconName: pt.tag.iconName,
                color: pt.tag.color,
            })),
        };

        return NextResponse.json(transformedProject);
    } catch (error) {
        console.error("Failed to fetch project:", error);
        return NextResponse.json(
            { error: "Failed to fetch project" },
            { status: 500 }
        );
    }
}

// PUT - Update a project by slug
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const body = await request.json();
        const { title, description, link, github, image, featured, tags, newSlug } = body;

        // Find the project
        const existingProject = await prisma.project.findUnique({
            where: { slug },
        });

        if (!existingProject) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        // Update the project
        const updatedProject = await prisma.project.update({
            where: { slug },
            data: {
                slug: newSlug || slug,
                title,
                description,
                link: link || null,
                github: github || null,
                image: image || null,
                featured: featured || false,
            },
        });

        // Handle tags if provided
        if (tags && Array.isArray(tags)) {
            // Remove existing tags
            await prisma.projectTag.deleteMany({
                where: { projectId: updatedProject.id },
            });

            // Add new tags
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
                        projectId: updatedProject.id,
                        tagId: tag.id,
                    },
                });
            }
        }

        // Fetch the complete project with tags
        const completeProject = await prisma.project.findUnique({
            where: { id: updatedProject.id },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        revalidatePath('/projects');
        revalidatePath(`/projects/${updatedProject.slug}`);
        revalidatePath('/');

        return NextResponse.json(completeProject);
    } catch (error) {
        console.error("Failed to update project:", error);
        return NextResponse.json(
            { error: "Failed to update project" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a project by slug
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        // Delete the project (cascade will delete related project_tags)
        await prisma.project.delete({
            where: { slug },
        });

        revalidatePath('/projects');
        revalidatePath('/');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete project:", error);
        return NextResponse.json(
            { error: "Failed to delete project" },
            { status: 500 }
        );
    }
}
