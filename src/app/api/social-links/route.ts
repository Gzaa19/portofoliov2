import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all social links
// Use ?all=true to get all (including inactive) for admin
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const fetchAll = searchParams.get('all') === 'true';

        const socialLinks = await prisma.socialLink.findMany({
            where: fetchAll ? {} : { isActive: true },
        });

        return NextResponse.json(socialLinks);
    } catch (error) {
        console.error('Error fetching social links:', error);
        return NextResponse.json(
            { error: 'Failed to fetch social links' },
            { status: 500 }
        );
    }
}

// POST create new social link
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, username, description, url, iconName, iconBg, isActive } = body;

        // Validate required fields
        if (!name || !username || !url || !iconName) {
            return NextResponse.json(
                { error: 'name, username, url, and iconName are required' },
                { status: 400 }
            );
        }

        const socialLink = await prisma.socialLink.create({
            data: {
                name,
                username,
                description,
                url,
                iconName,
                iconBg,
                isActive: isActive ?? true,
            },
        });

        return NextResponse.json(socialLink, { status: 201 });
    } catch (error) {
        console.error('Error creating social link:', error);
        return NextResponse.json(
            { error: 'Failed to create social link' },
            { status: 500 }
        );
    }
}
