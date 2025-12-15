import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
    params: Promise<{
        slug: string;
    }>;
}

// GET single project by slug
export async function GET(request: Request, { params }: Params) {
    try {
        const { slug } = await params;

        const project = await prisma.project.findUnique({
            where: { slug },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        const transformedProject = {
            ...project,
            tags: project.tags.map((pt) => pt.tag),
        };

        return NextResponse.json(transformedProject);
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json(
            { error: 'Failed to fetch project' },
            { status: 500 }
        );
    }
}

// PUT update project
export async function PUT(request: Request, { params }: Params) {
    try {
        const { slug } = await params;
        const body = await request.json();
        const { title, description, link, github, image, featured, tags, newSlug } = body;

        // Check if project exists
        const existingProject = await prisma.project.findUnique({
            where: { slug },
        });

        if (!existingProject) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        // If tags are being updated, delete existing and create new
        if (tags) {
            await prisma.projectTag.deleteMany({
                where: { projectId: existingProject.id },
            });
        }

        const project = await prisma.project.update({
            where: { slug },
            data: {
                slug: newSlug ?? slug,
                title,
                description,
                link,
                github,
                image,
                featured,
                tags: tags ? {
                    create: tags.map((tagName: string) => ({
                        tag: {
                            connectOrCreate: {
                                where: { name: tagName },
                                create: {
                                    name: tagName,
                                    slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                                },
                            },
                        },
                    })),
                } : undefined,
            },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        const transformedProject = {
            ...project,
            tags: project.tags.map((pt) => pt.tag),
        };

        return NextResponse.json(transformedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json(
            { error: 'Failed to update project' },
            { status: 500 }
        );
    }
}

// DELETE project
export async function DELETE(request: Request, { params }: Params) {
    try {
        const { slug } = await params;

        const project = await prisma.project.findUnique({
            where: { slug },
        });

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        await prisma.project.delete({
            where: { slug },
        });

        return NextResponse.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        );
    }
}
