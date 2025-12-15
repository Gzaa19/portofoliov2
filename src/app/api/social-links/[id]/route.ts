import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
    params: Promise<{
        id: string;
    }>;
}

// GET single social link by id
export async function GET(request: Request, { params }: Params) {
    try {
        const { id } = await params;

        const socialLink = await prisma.socialLink.findUnique({
            where: { id },
        });

        if (!socialLink) {
            return NextResponse.json(
                { error: 'Social link not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(socialLink);
    } catch (error) {
        console.error('Error fetching social link:', error);
        return NextResponse.json(
            { error: 'Failed to fetch social link' },
            { status: 500 }
        );
    }
}

// PUT update social link
export async function PUT(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, username, description, url, iconName, iconBg, isActive } = body;

        const existingSocialLink = await prisma.socialLink.findUnique({
            where: { id },
        });

        if (!existingSocialLink) {
            return NextResponse.json(
                { error: 'Social link not found' },
                { status: 404 }
            );
        }

        const socialLink = await prisma.socialLink.update({
            where: { id },
            data: {
                name,
                username,
                description,
                url,
                iconName,
                iconBg,
                isActive,
            },
        });

        return NextResponse.json(socialLink);
    } catch (error) {
        console.error('Error updating social link:', error);
        return NextResponse.json(
            { error: 'Failed to update social link' },
            { status: 500 }
        );
    }
}

// DELETE social link
export async function DELETE(request: Request, { params }: Params) {
    try {
        const { id } = await params;

        const socialLink = await prisma.socialLink.findUnique({
            where: { id },
        });

        if (!socialLink) {
            return NextResponse.json(
                { error: 'Social link not found' },
                { status: 404 }
            );
        }

        await prisma.socialLink.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Social link deleted successfully' });
    } catch (error) {
        console.error('Error deleting social link:', error);
        return NextResponse.json(
            { error: 'Failed to delete social link' },
            { status: 500 }
        );
    }
}
