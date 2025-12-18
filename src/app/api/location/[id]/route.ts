import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

interface Params {
    params: Promise<{
        id: string;
    }>;
}

// GET single location by id
export async function GET(request: Request, { params }: Params) {
    try {
        const { id } = await params;

        const location = await prisma.location.findUnique({
            where: { id },
        });

        if (!location) {
            return NextResponse.json(
                { error: 'Location not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(location);
    } catch (error) {
        console.error('Error fetching location:', error);
        return NextResponse.json(
            { error: 'Failed to fetch location' },
            { status: 500 }
        );
    }
}

// PUT update location
export async function PUT(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, address, latitude, longitude, zoom, isActive } = body;

        const existingLocation = await prisma.location.findUnique({
            where: { id },
        });

        if (!existingLocation) {
            return NextResponse.json(
                { error: 'Location not found' },
                { status: 404 }
            );
        }

        // If activating this location, deactivate others first
        if (isActive === true && !existingLocation.isActive) {
            await prisma.location.updateMany({
                where: {
                    isActive: true,
                    NOT: { id },
                },
                data: { isActive: false },
            });
        }

        const location = await prisma.location.update({
            where: { id },
            data: {
                name,
                address,
                latitude: latitude !== undefined ? parseFloat(latitude) : undefined,
                longitude: longitude !== undefined ? parseFloat(longitude) : undefined,
                zoom: zoom !== undefined ? parseInt(zoom) : undefined,
                isActive,
            },
        });

        // Revalidate pages that display location
        revalidatePath('/');
        revalidatePath('/contact');

        return NextResponse.json(location);
    } catch (error) {
        console.error('Error updating location:', error);
        return NextResponse.json(
            { error: 'Failed to update location' },
            { status: 500 }
        );
    }
}

// DELETE location
export async function DELETE(request: Request, { params }: Params) {
    try {
        const { id } = await params;

        const location = await prisma.location.findUnique({
            where: { id },
        });

        if (!location) {
            return NextResponse.json(
                { error: 'Location not found' },
                { status: 404 }
            );
        }

        await prisma.location.delete({
            where: { id },
        });

        // Revalidate pages that display location
        revalidatePath('/');
        revalidatePath('/contact');

        return NextResponse.json({ message: 'Location deleted successfully' });
    } catch (error) {
        console.error('Error deleting location:', error);
        return NextResponse.json(
            { error: 'Failed to delete location' },
            { status: 500 }
        );
    }
}
