
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const profile = await prisma.profile.findFirst({
            where: { isActive: true },
        });
        return NextResponse.json(profile || {});
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { description, photoUrl, resumeUrl } = body;

        // Check if a profile exists
        const existingProfile = await prisma.profile.findFirst({
            where: { isActive: true },
        });

        let profile;

        if (existingProfile) {
            // Update existing
            profile = await prisma.profile.update({
                where: { id: existingProfile.id },
                data: {
                    description,
                    photoUrl,
                    resumeUrl,
                },
            });
        } else {
            // Create new
            profile = await prisma.profile.create({
                data: {
                    description,
                    photoUrl,
                    resumeUrl,
                    isActive: true,
                },
            });
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
