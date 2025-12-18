import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

interface Params {
    params: Promise<{ id: string }>;
}

// GET - Get category by ID
export async function GET(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const category = await prisma.toolboxCategory.findUnique({
            where: { id },
            include: {
                items: {
                    orderBy: { order: 'asc' },
                },
            },
        });

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error("Failed to fetch category:", error);
        return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
    }
}

// PUT - Update category
export async function PUT(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const body = await request.json();

        const category = await prisma.toolboxCategory.update({
            where: { id },
            data: body,
        });

        // Revalidate toolbox page
        revalidatePath('/');
        revalidatePath('/toolbox');

        return NextResponse.json(category);
    } catch (error) {
        console.error("Failed to update category:", error);
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}

// DELETE - Delete category
export async function DELETE(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        await prisma.toolboxCategory.delete({ where: { id } });

        // Revalidate toolbox page
        revalidatePath('/');
        revalidatePath('/toolbox');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete category:", error);
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}
