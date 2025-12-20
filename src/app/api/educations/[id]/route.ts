import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

// GET - Fetch a single education by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const education = await prisma.education.findUnique({
            where: { id },
        });

        if (!education) {
            return NextResponse.json(
                { error: "Education not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(education);
    } catch (error) {
        console.error("Failed to fetch education:", error);
        return NextResponse.json(
            { error: "Failed to fetch education" },
            { status: 500 }
        );
    }
}

// PUT - Update an education by ID
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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

        // Find the education
        const existingEducation = await prisma.education.findUnique({
            where: { id },
        });

        if (!existingEducation) {
            return NextResponse.json(
                { error: "Education not found" },
                { status: 404 }
            );
        }

        // If isCurrent is true, set endDate to null
        const finalEndDate = isCurrent ? null : endDate ? new Date(endDate) : existingEducation.endDate;

        // Update the education
        const updatedEducation = await prisma.education.update({
            where: { id },
            data: {
                school: school ?? existingEducation.school,
                degree: degree !== undefined ? degree : existingEducation.degree,
                fieldOfStudy: fieldOfStudy !== undefined ? fieldOfStudy : existingEducation.fieldOfStudy,
                startDate: startDate ? new Date(startDate) : existingEducation.startDate,
                endDate: finalEndDate,
                isCurrent: isCurrent !== undefined ? isCurrent : existingEducation.isCurrent,
                grade: grade !== undefined ? grade : existingEducation.grade,
                activities: activities !== undefined ? activities : existingEducation.activities,
                description: description !== undefined ? description : existingEducation.description,
                logoUrl: logoUrl !== undefined ? logoUrl : existingEducation.logoUrl,
                order: order !== undefined ? order : existingEducation.order,
                isActive: isActive !== undefined ? isActive : existingEducation.isActive,
            },
        });

        revalidatePath('/');
        revalidatePath('/about');

        return NextResponse.json(updatedEducation);
    } catch (error) {
        console.error("Failed to update education:", error);
        return NextResponse.json(
            { error: "Failed to update education" },
            { status: 500 }
        );
    }
}

// DELETE - Delete an education by ID
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Check if education exists
        const existingEducation = await prisma.education.findUnique({
            where: { id },
        });

        if (!existingEducation) {
            return NextResponse.json(
                { error: "Education not found" },
                { status: 404 }
            );
        }

        // Delete the education
        await prisma.education.delete({
            where: { id },
        });

        revalidatePath('/');
        revalidatePath('/about');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete education:", error);
        return NextResponse.json(
            { error: "Failed to delete education" },
            { status: 500 }
        );
    }
}
