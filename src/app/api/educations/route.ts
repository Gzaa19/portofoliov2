import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

// GET - Fetch all educations
export async function GET() {
    try {
        const educations = await prisma.education.findMany({
            orderBy: [
                { isCurrent: 'desc' },
                { startDate: 'desc' },
                { order: 'asc' },
            ],
        });

        return NextResponse.json(educations);
    } catch (error) {
        console.error("Failed to fetch educations:", error);
        return NextResponse.json(
            { error: "Failed to fetch educations" },
            { status: 500 }
        );
    }
}

// POST - Create new education
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            school,
            degree,
            fieldOfStudy,
            startDate,
            endDate,
            isCurrent,
            grade,
            activities,
            description,
            logoUrl,
            order,
            isActive,
        } = body;

        // Validate required fields
        if (!school || !startDate) {
            return NextResponse.json(
                { error: "Missing required fields: school, startDate" },
                { status: 400 }
            );
        }

        // If isCurrent is true, set endDate to null
        const finalEndDate = isCurrent ? null : endDate ? new Date(endDate) : null;

        // Create the education
        const education = await prisma.education.create({
            data: {
                school,
                degree: degree || null,
                fieldOfStudy: fieldOfStudy || null,
                startDate: new Date(startDate),
                endDate: finalEndDate,
                isCurrent: isCurrent || false,
                grade: grade || null,
                activities: activities || null,
                description: description || null,
                logoUrl: logoUrl || null,
                order: order || 0,
                isActive: isActive !== undefined ? isActive : true,
            },
        });

        revalidatePath('/');
        revalidatePath('/about');

        return NextResponse.json(education, { status: 201 });
    } catch (error) {
        console.error("Failed to create education:", error);
        return NextResponse.json(
            { error: "Failed to create education" },
            { status: 500 }
        );
    }
}
