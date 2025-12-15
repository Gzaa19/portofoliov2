import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET location
// Use ?all=true to get all locations for admin
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const fetchAll = searchParams.get('all') === 'true';

        if (fetchAll) {
            // Return all locations for admin
            const locations = await prisma.location.findMany({
                orderBy: { createdAt: 'desc' },
            });
            return NextResponse.json(locations);
        }

        // Get active location for public
        const location = await prisma.location.findFirst({
            where: { isActive: true },
        });

        if (!location) {
            return NextResponse.json(null);
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

// POST create new location
// Only allowed if no active location exists
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, address, latitude, longitude, zoom } = body;

        // Validate required fields
        if (!name || latitude === undefined || longitude === undefined) {
            return NextResponse.json(
                { error: 'name, latitude, and longitude are required' },
                { status: 400 }
            );
        }

        // Check if there's already an active location
        const existingActive = await prisma.location.findFirst({
            where: { isActive: true },
        });

        if (existingActive) {
            return NextResponse.json(
                {
                    error: 'Sudah ada lokasi aktif. Matikan lokasi yang ada atau update lokasi tersebut.',
                    existingLocation: existingActive,
                },
                { status: 400 }
            );
        }

        // Parse values - handle both number and string types
        const parsedLatitude = typeof latitude === 'number' ? latitude : parseFloat(String(latitude));
        const parsedLongitude = typeof longitude === 'number' ? longitude : parseFloat(String(longitude));
        const parsedZoom = typeof zoom === 'number' ? zoom : (zoom ? parseInt(String(zoom)) : 12);

        // Validate parsed values
        if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
            return NextResponse.json(
                { error: 'Invalid latitude or longitude values' },
                { status: 400 }
            );
        }

        const location = await prisma.location.create({
            data: {
                name,
                address: address || null,
                latitude: parsedLatitude,
                longitude: parsedLongitude,
                zoom: parsedZoom,
                isActive: true,
            },
        });

        return NextResponse.json(location, { status: 201 });
    } catch (error) {
        console.error('Error creating location:', error);
        return NextResponse.json(
            { error: 'Failed to create location: ' + (error instanceof Error ? error.message : 'Unknown error') },
            { status: 500 }
        );
    }
}
