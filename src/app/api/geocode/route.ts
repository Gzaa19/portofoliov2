import { NextResponse } from 'next/server';

// Geocoding API using OpenStreetMap Nominatim (free, no API key required)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json(
                { error: 'Query parameter "q" is required' },
                { status: 400 }
            );
        }

        // Use OpenStreetMap Nominatim for geocoding
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?` +
            new URLSearchParams({
                q: query,
                format: 'json',
                limit: '5',
                addressdetails: '1',
            }),
            {
                headers: {
                    'User-Agent': 'Portfolio-App/1.0',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Geocoding API request failed');
        }

        const data = await response.json();

        // Transform response
        const results = data.map((item: {
            place_id: number;
            display_name: string;
            lat: string;
            lon: string;
            address?: {
                city?: string;
                state?: string;
                country?: string;
            };
        }) => ({
            id: item.place_id,
            name: item.display_name,
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
            address: item.display_name,
            city: item.address?.city,
            state: item.address?.state,
            country: item.address?.country,
        }));

        return NextResponse.json(results);
    } catch (error) {
        console.error('Geocoding error:', error);
        return NextResponse.json(
            { error: 'Failed to geocode location' },
            { status: 500 }
        );
    }
}
