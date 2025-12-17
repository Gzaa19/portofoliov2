import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Fetch active hero settings
export async function GET() {
    try {
        let heroSettings = await prisma.heroSettings.findFirst({
            where: { isActive: true },
        });

        // If no settings exist, create default
        if (!heroSettings) {
            heroSettings = await prisma.heroSettings.create({
                data: {
                    name: "Gzaaa",
                    role: "Full Stack Developer",
                    status: "busy",
                    isActive: true,
                },
            });
        }

        return NextResponse.json(heroSettings);
    } catch (error) {
        console.error("Failed to fetch hero settings:", error);
        return NextResponse.json(
            { error: "Failed to fetch hero settings" },
            { status: 500 }
        );
    }
}

// PUT - Update hero settings
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { name, role, status } = body;

        // Find active settings
        let heroSettings = await prisma.heroSettings.findFirst({
            where: { isActive: true },
        });

        if (heroSettings) {
            // Update existing
            heroSettings = await prisma.heroSettings.update({
                where: { id: heroSettings.id },
                data: { name, role, status },
            });
        } else {
            // Create new
            heroSettings = await prisma.heroSettings.create({
                data: {
                    name,
                    role,
                    status,
                    isActive: true,
                },
            });
        }

        return NextResponse.json(heroSettings);
    } catch (error) {
        console.error("Failed to update hero settings:", error);
        return NextResponse.json(
            { error: "Failed to update hero settings" },
            { status: 500 }
        );
    }
}
