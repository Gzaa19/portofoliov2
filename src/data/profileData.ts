/**
 * Data Access Layer (DAL) for Profile
 * 
 * This file contains functions that directly access the database
 * for profile-related data. Use these in Server Components.
 */

import { prisma } from "@/lib/prisma";

export interface Profile {
    id: string;
    description: string;
    photoUrl: string | null;
    resumeUrl: string | null;
    isActive: boolean;
}

export interface ProfileData {
    description: string;
    photoUrl?: string;
    resumeUrl?: string;
}

/**
 * Fetch the active profile from the database
 */
export async function getProfile(): Promise<Profile | null> {
    try {
        const profile = await prisma.profile.findFirst({
            where: { isActive: true },
        });
        return profile;
    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

/**
 * Get formatted profile data for views
 * Converts null values to undefined for optional props
 */
export async function getProfileData(): Promise<ProfileData | undefined> {
    const profile = await getProfile();

    if (!profile) return undefined;

    return {
        description: profile.description,
        photoUrl: profile.photoUrl ?? undefined,
        resumeUrl: profile.resumeUrl ?? undefined,
    };
}
