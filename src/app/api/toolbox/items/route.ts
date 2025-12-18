import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

// GET - Get all items (optional: filter by categoryId)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get("categoryId");
        const all = searchParams.get("all");

        const where = all ? {} : { isActive: true };
        if (categoryId) {
            Object.assign(where, { categoryId });
        }

        const items = await prisma.toolboxItem.findMany({
            where,
            include: { category: true },
            orderBy: { order: 'asc' },
        });

        return NextResponse.json(items);
    } catch (error) {
        console.error("Failed to fetch items:", error);
        return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
    }
}

// POST - Create new item
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, iconName, color, order, categoryId } = body;

        const item = await prisma.toolboxItem.create({
            data: {
                name,
                iconName,
                color,
                order: order || 0,
                categoryId,
            },
        });

        // Revalidate toolbox page
        revalidatePath('/');
        revalidatePath('/toolbox');

        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        console.error("Failed to create item:", error);
        return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
    }
}
