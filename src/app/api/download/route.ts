import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');
    const filename = searchParams.get('filename') || 'resume.pdf';

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        // Fetch the file from Cloudinary
        const response = await fetch(url);

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch file' },
                { status: response.status }
            );
        }

        // Get the file content
        const fileBuffer = await response.arrayBuffer();

        // Return with proper headers for download
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': fileBuffer.byteLength.toString(),
            },
        });
    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json(
            { error: 'Failed to download file' },
            { status: 500 }
        );
    }
}
