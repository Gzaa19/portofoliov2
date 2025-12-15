import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        // Find admin by username
        const admin = await prisma.admin.findUnique({
            where: { username },
        });

        if (!admin) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, admin.password);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Set auth cookie
        const cookieStore = await cookies();
        cookieStore.set('admin_auth', admin.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return NextResponse.json({
            success: true,
            admin: {
                id: admin.id,
                username: admin.username,
                name: admin.name,
            }
        });
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('admin_auth');
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const cookieStore = await cookies();
        const auth = cookieStore.get('admin_auth');

        if (!auth?.value) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        // Verify admin exists
        const admin = await prisma.admin.findUnique({
            where: { id: auth.value },
            select: { id: true, username: true, name: true },
        });

        if (!admin) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        return NextResponse.json({
            authenticated: true,
            admin
        });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
