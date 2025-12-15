import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all projects
export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        // Transform data untuk flatten tags
        const transformedProjects = projects.map((project) => ({
            ...project,
            tags: project.tags.map((pt) => pt.tag),
        }));

        return NextResponse.json(transformedProjects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

// POST create new project
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { slug, title, description, link, github, image, featured, tags } = body;

        // Validate required fields
        if (!slug || !title || !description) {
            return NextResponse.json(
                { error: 'slug, title, and description are required' },
                { status: 400 }
            );
        }

        // Create project with tags
        const project = await prisma.project.create({
            data: {
                slug,
                title,
                description,
                link,
                github,
                image,
                featured: featured ?? false,
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

        return NextResponse.json(transformedProject, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            { error: 'Failed to create project' },
            { status: 500 }
        );
    }
}
