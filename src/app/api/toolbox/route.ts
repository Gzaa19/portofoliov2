import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Get all categories with items
export async function GET() {
    try {
        const categories = await prisma.toolboxCategory.findMany({
            where: { isActive: true },
            include: {
                items: {
                    where: { isActive: true },
                    orderBy: { order: 'asc' },
                },
            },
            orderBy: { order: 'asc' },
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error("Failed to fetch toolbox:", error);
        return NextResponse.json({ error: "Failed to fetch toolbox" }, { status: 500 });
    }
}

// POST - Create new category
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, order } = body;

        const category = await prisma.toolboxCategory.create({
            data: {
                name,
                order: order || 0,
            },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error("Failed to create category:", error);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}
