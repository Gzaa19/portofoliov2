import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

// GET - Fetch all project categories
export async function GET() {
    try {
        const categories = await prisma.projectCategory.findMany({
            where: {
                isActive: true,
            },
            include: {
                _count: {
                    select: { projects: true },
                },
            },
            orderBy: [
                { order: 'asc' },
                { name: 'asc' },
            ],
        });

        // Transform to include project count
        const transformedCategories = categories.map((category) => ({
            ...category,
            projectCount: category._count.projects,
            _count: undefined,
        }));

        return NextResponse.json(transformedCategories);
    } catch (error) {
        console.error("Failed to fetch project categories:", error);
        return NextResponse.json(
            { error: "Failed to fetch project categories" },
            { status: 500 }
        );
    }
}

// POST - Create new project category
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, color, iconName, order } = body;

        // Generate slug from name
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        // Check if category with same name or slug exists
        const existing = await prisma.projectCategory.findFirst({
            where: {
                OR: [
                    { name },
                    { slug },
                ],
            },
        });

        if (existing) {
            return NextResponse.json(
                { error: "Category with this name already exists" },
                { status: 400 }
            );
        }

        const category = await prisma.projectCategory.create({
            data: {
                name,
                slug,
                description: description || null,
                color: color || null,
                iconName: iconName || null,
                order: order ?? 0,
                isActive: true,
            },
        });

        revalidatePath('/projects');
        revalidatePath('/admin/projects');

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error("Failed to create project category:", error);
        return NextResponse.json(
            { error: "Failed to create project category" },
            { status: 500 }
        );
    }
}
