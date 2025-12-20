import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

// GET - Fetch a single experience by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const experience = await prisma.experience.findUnique({
            where: { id },
            include: {
                skills: true,
            },
        });

        if (!experience) {
            return NextResponse.json(
                { error: "Experience not found" },
                { status: 404 }
            );
        }

        // Transform the data
        const transformedExperience = {
            ...experience,
            skills: experience.skills.map((s) => s.skillName),
        };

        return NextResponse.json(transformedExperience);
    } catch (error) {
        console.error("Failed to fetch experience:", error);
        return NextResponse.json(
            { error: "Failed to fetch experience" },
            { status: 500 }
        );
    }
}

// PUT - Update an experience by ID
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const {
            companyName,
            companyLogo,
            companyUrl,
            title,
            employmentType,
            location,
            locationType,
            startDate,
            endDate,
            isCurrent,
            description,
            order,
            isActive,
            skills,
        } = body;

        // Find the experience
        const existingExperience = await prisma.experience.findUnique({
            where: { id },
        });

        if (!existingExperience) {
            return NextResponse.json(
                { error: "Experience not found" },
                { status: 404 }
            );
        }

        // If isCurrent is true, set endDate to null
        const finalEndDate = isCurrent ? null : endDate ? new Date(endDate) : existingExperience.endDate;

        // Update the experience
        const updatedExperience = await prisma.experience.update({
            where: { id },
            data: {
                companyName: companyName ?? existingExperience.companyName,
                companyLogo: companyLogo !== undefined ? companyLogo : existingExperience.companyLogo,
                companyUrl: companyUrl !== undefined ? companyUrl : existingExperience.companyUrl,
                title: title ?? existingExperience.title,
                employmentType: employmentType ?? existingExperience.employmentType,
                location: location !== undefined ? location : existingExperience.location,
                locationType: locationType ?? existingExperience.locationType,
                startDate: startDate ? new Date(startDate) : existingExperience.startDate,
                endDate: finalEndDate,
                isCurrent: isCurrent !== undefined ? isCurrent : existingExperience.isCurrent,
                description: description !== undefined ? description : existingExperience.description,
                order: order !== undefined ? order : existingExperience.order,
                isActive: isActive !== undefined ? isActive : existingExperience.isActive,
            },
        });

        // Handle skills if provided
        if (skills && Array.isArray(skills)) {
            // Remove existing skills
            await prisma.experienceSkill.deleteMany({
                where: { experienceId: id },
            });

            // Add new skills
            if (skills.length > 0) {
                await prisma.experienceSkill.createMany({
                    data: skills.map((skillName: string) => ({
                        experienceId: id,
                        skillName,
                    })),
                });
            }
        }

        // Fetch the complete experience with skills
        const completeExperience = await prisma.experience.findUnique({
            where: { id: updatedExperience.id },
            include: {
                skills: true,
            },
        });

        // Transform for response
        const transformedExperience = completeExperience ? {
            ...completeExperience,
            skills: completeExperience.skills.map((s) => s.skillName),
        } : null;

        revalidatePath('/');
        revalidatePath('/about');

        return NextResponse.json(transformedExperience);
    } catch (error) {
        console.error("Failed to update experience:", error);
        return NextResponse.json(
            { error: "Failed to update experience" },
            { status: 500 }
        );
    }
}

// DELETE - Delete an experience by ID
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Check if experience exists
        const existingExperience = await prisma.experience.findUnique({
            where: { id },
        });

        if (!existingExperience) {
            return NextResponse.json(
                { error: "Experience not found" },
                { status: 404 }
            );
        }

        // Delete the experience (cascade will delete related skills)
        await prisma.experience.delete({
            where: { id },
        });

        revalidatePath('/');
        revalidatePath('/about');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete experience:", error);
        return NextResponse.json(
            { error: "Failed to delete experience" },
            { status: 500 }
        );
    }
}
