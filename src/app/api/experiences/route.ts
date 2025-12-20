import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

// Employment type labels for display
export const EMPLOYMENT_TYPES = {
    full_time: "Full-time",
    part_time: "Part-time",
    self_employed: "Self-employed",
    freelance: "Freelance",
    contract: "Contract",
    internship: "Internship",
    apprenticeship: "Apprenticeship",
    seasonal: "Seasonal",
} as const;

// Location type labels for display
export const LOCATION_TYPES = {
    on_site: "On-site",
    hybrid: "Hybrid",
    remote: "Remote",
} as const;

// GET - Fetch all experiences
export async function GET() {
    try {
        const experiences = await prisma.experience.findMany({
            orderBy: [
                { isCurrent: 'desc' },
                { startDate: 'desc' },
                { order: 'asc' },
            ],
        });

        return NextResponse.json(experiences);
    } catch (error) {
        console.error("Failed to fetch experiences:", error);
        return NextResponse.json(
            { error: "Failed to fetch experiences" },
            { status: 500 }
        );
    }
}

// POST - Create new experience
export async function POST(request: Request) {
    try {
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
        } = body;

        // Validate required fields
        if (!companyName || !title || !employmentType || !startDate) {
            return NextResponse.json(
                { error: "Missing required fields: companyName, title, employmentType, startDate" },
                { status: 400 }
            );
        }

        // If isCurrent is true, set endDate to null
        const finalEndDate = isCurrent ? null : endDate ? new Date(endDate) : null;

        // Create the experience
        const experience = await prisma.experience.create({
            data: {
                companyName,
                companyLogo: companyLogo || null,
                companyUrl: companyUrl || null,
                title,
                employmentType,
                location: location || null,
                locationType: locationType || "on_site",
                startDate: new Date(startDate),
                endDate: finalEndDate,
                isCurrent: isCurrent || false,
                description: description || null,
                order: order || 0,
                isActive: isActive !== undefined ? isActive : true,
            },
        });

        revalidatePath('/');
        revalidatePath('/about');

        return NextResponse.json(experience, { status: 201 });
    } catch (error) {
        console.error("Failed to create experience:", error);
        return NextResponse.json(
            { error: "Failed to create experience" },
            { status: 500 }
        );
    }
}
