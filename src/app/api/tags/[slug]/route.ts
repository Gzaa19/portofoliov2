import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
    params: {
        slug: string;
    };
}

// GET single tag by slug
export async function GET(request: Request, { params }: Params) {
    try {
        const { slug } = await params;

        const tag = await prisma.tag.findUnique({
            where: { slug },
            include: {
                projects: {
                    include: {
                        project: true,
                    },
                },
            },
        });

        if (!tag) {
            return NextResponse.json(
                { error: 'Tag not found' },
                { status: 404 }
            );
        }

        const transformedTag = {
            ...tag,
            projects: tag.projects.map((pt) => pt.project),
        };

        return NextResponse.json(transformedTag);
    } catch (error) {
        console.error('Error fetching tag:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tag' },
            { status: 500 }
        );
    }
}

// PUT update tag
export async function PUT(request: Request, { params }: Params) {
    try {
        const { slug } = await params;
        const body = await request.json();
        const { name, color, newSlug } = body;

        const existingTag = await prisma.tag.findUnique({
            where: { slug },
        });

        if (!existingTag) {
            return NextResponse.json(
                { error: 'Tag not found' },
                { status: 404 }
            );
        }

        const tag = await prisma.tag.update({
            where: { slug },
            data: {
                name,
                slug: newSlug ?? slug,
                color,
            },
        });

        return NextResponse.json(tag);
    } catch (error) {
        console.error('Error updating tag:', error);
        return NextResponse.json(
            { error: 'Failed to update tag' },
            { status: 500 }
        );
    }
}

// DELETE tag
export async function DELETE(request: Request, { params }: Params) {
    try {
        const { slug } = await params;

        const tag = await prisma.tag.findUnique({
            where: { slug },
        });

        if (!tag) {
            return NextResponse.json(
                { error: 'Tag not found' },
                { status: 404 }
            );
        }

        await prisma.tag.delete({
            where: { slug },
        });

        return NextResponse.json({ message: 'Tag deleted successfully' });
    } catch (error) {
        console.error('Error deleting tag:', error);
        return NextResponse.json(
            { error: 'Failed to delete tag' },
            { status: 500 }
        );
    }
}
