import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

type RouteContext = {
    params: Promise<{ id: string }>;
};

// GET - Fetch single project category by ID
export async function GET(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const { id } = await context.params;

        const category = await prisma.projectCategory.findUnique({
            where: { id },
            include: {
                projects: {
                    include: {
                        tags: {
                            include: {
                                tag: true,
                            },
                        },
                    },
                    orderBy: [
                        { featured: 'desc' },
                        { order: 'asc' },
                        { createdAt: 'desc' },
                    ],
                },
            },
        });

        if (!category) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        // Transform projects to include tags directly
        const transformedCategory = {
            ...category,
            projects: category.projects.map((project) => ({
                ...project,
                tags: project.tags.map((pt) => ({
                    id: pt.tag.id,
                    name: pt.tag.name,
                    slug: pt.tag.slug,
                    iconName: pt.tag.iconName,
                    color: pt.tag.color,
                })),
            })),
        };

        return NextResponse.json(transformedCategory);
    } catch (error) {
        console.error("Failed to fetch project category:", error);
        return NextResponse.json(
            { error: "Failed to fetch project category" },
            { status: 500 }
        );
    }
}

// PUT - Update project category
export async function PUT(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const { name, description, color, iconName, order, isActive } = body;

        // Check if category exists
        const existing = await prisma.projectCategory.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        // Generate new slug if name changed
        let slug = existing.slug;
        if (name && name !== existing.name) {
            slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            // Check if new slug conflicts with another category
            const slugConflict = await prisma.projectCategory.findFirst({
                where: {
                    slug,
                    id: { not: id },
                },
            });

            if (slugConflict) {
                return NextResponse.json(
                    { error: "Category with this name already exists" },
                    { status: 400 }
                );
            }
        }

        const category = await prisma.projectCategory.update({
            where: { id },
            data: {
                name: name ?? existing.name,
                slug,
                description: description !== undefined ? description : existing.description,
                color: color !== undefined ? color : existing.color,
                iconName: iconName !== undefined ? iconName : existing.iconName,
                order: order ?? existing.order,
                isActive: isActive ?? existing.isActive,
            },
        });

        revalidatePath('/projects');
        revalidatePath('/admin/projects');

        return NextResponse.json(category);
    } catch (error) {
        console.error("Failed to update project category:", error);
        return NextResponse.json(
            { error: "Failed to update project category" },
            { status: 500 }
        );
    }
}

// DELETE - Delete project category
export async function DELETE(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const { id } = await context.params;

        // Check if category exists
        const existing = await prisma.projectCategory.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { projects: true },
                },
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        // Check if category has projects
        if (existing._count.projects > 0) {
            return NextResponse.json(
                {
                    error: "Cannot delete category with existing projects. Please reassign or delete projects first.",
                    projectCount: existing._count.projects,
                },
                { status: 400 }
            );
        }

        await prisma.projectCategory.delete({
            where: { id },
        });

        revalidatePath('/projects');
        revalidatePath('/admin/projects');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete project category:", error);
        return NextResponse.json(
            { error: "Failed to delete project category" },
            { status: 500 }
        );
    }
}
