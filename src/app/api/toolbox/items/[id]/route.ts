import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
    params: Promise<{ id: string }>;
}

// GET - Get item by ID
export async function GET(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const item = await prisma.toolboxItem.findUnique({
            where: { id },
            include: { category: true },
        });

        if (!item) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        return NextResponse.json(item);
    } catch (error) {
        console.error("Failed to fetch item:", error);
        return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
    }
}

// PUT - Update item
export async function PUT(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const body = await request.json();

        const item = await prisma.toolboxItem.update({
            where: { id },
            data: body,
        });

        return NextResponse.json(item);
    } catch (error) {
        console.error("Failed to update item:", error);
        return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }
}

// DELETE - Delete item
export async function DELETE(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        await prisma.toolboxItem.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete item:", error);
        return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }
}
