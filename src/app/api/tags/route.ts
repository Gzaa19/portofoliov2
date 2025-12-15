import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all tags
export async function GET() {
    try {
        const tags = await prisma.tag.findMany({
            include: {
                _count: {
                    select: { projects: true },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });

        // Transform to include project count
        const transformedTags = tags.map((tag) => ({
            ...tag,
            projectCount: tag._count.projects,
            _count: undefined,
        }));

        return NextResponse.json(transformedTags);
    } catch (error) {
        console.error('Error fetching tags:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tags' },
            { status: 500 }
        );
    }
}

// POST create new tag
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, color } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'name is required' },
                { status: 400 }
            );
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const tag = await prisma.tag.create({
            data: {
                name,
                slug,
                color,
            },
        });

        return NextResponse.json(tag, { status: 201 });
    } catch (error) {
        console.error('Error creating tag:', error);
        return NextResponse.json(
            { error: 'Failed to create tag' },
            { status: 500 }
        );
    }
}
