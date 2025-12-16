import { NextResponse } from 'next/server';
import { uploadFile } from '@/lib/cloudinary';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { image, folder = 'portfolio/projects', resourceType = 'image' } = body;

        if (!image) {
            return NextResponse.json(
                { error: 'File data is required' },
                { status: 400 }
            );
        }

        // Upload to Cloudinary
        const result = await uploadFile(image, folder, resourceType);

        return NextResponse.json({
            url: result.url,
            publicId: result.publicId,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}
