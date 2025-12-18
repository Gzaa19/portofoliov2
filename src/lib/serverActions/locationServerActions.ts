"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface LocationFormData {
    name: string;
    address?: string;
    latitude: number;
    longitude: number;
    zoom?: number;
    isActive?: boolean;
}

export async function getLocationAction() {
    try {
        const location = await prisma.location.findFirst({
            where: { isActive: true },
        });
        return { success: true, data: location };
    } catch (error) {
        console.error("Failed to fetch location:", error);
        return { success: false, error: "Failed to fetch location" };
    }
}

export async function getAllLocationsAction() {
    try {
        const locations = await prisma.location.findMany({
            orderBy: { createdAt: "desc" },
        });
        return { success: true, data: locations };
    } catch (error) {
        console.error("Failed to fetch locations:", error);
        return { success: false, error: "Failed to fetch locations" };
    }
}

export async function createLocationAction(formData: LocationFormData) {
    try {
        const { name, address, latitude, longitude, zoom } = formData;

        if (!name || latitude === undefined || longitude === undefined) {
            return { success: false, error: "name, latitude, and longitude are required" };
        }

        // Check if there's already an active location
        const existingActive = await prisma.location.findFirst({
            where: { isActive: true },
        });

        if (existingActive) {
            return {
                success: false,
                error: "Sudah ada lokasi aktif. Matikan lokasi yang ada atau update lokasi tersebut.",
            };
        }

        const location = await prisma.location.create({
            data: {
                name,
                address: address || null,
                latitude,
                longitude,
                zoom: zoom || 12,
                isActive: true,
            },
        });

        // Revalidate pages that display location
        revalidatePath("/");
        revalidatePath("/contact");

        return { success: true, data: location };
    } catch (error) {
        console.error("Failed to create location:", error);
        return { success: false, error: "Failed to create location" };
    }
}

export async function updateLocationAction(id: string, formData: LocationFormData) {
    try {
        const { name, address, latitude, longitude, zoom, isActive } = formData;

        const existingLocation = await prisma.location.findUnique({
            where: { id },
        });

        if (!existingLocation) {
            return { success: false, error: "Location not found" };
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
                latitude,
                longitude,
                zoom,
                isActive,
            },
        });

        // Revalidate pages that display location
        revalidatePath("/");
        revalidatePath("/contact");

        return { success: true, data: location };
    } catch (error) {
        console.error("Failed to update location:", error);
        return { success: false, error: "Failed to update location" };
    }
}

export async function deleteLocationAction(id: string) {
    try {
        const location = await prisma.location.findUnique({
            where: { id },
        });

        if (!location) {
            return { success: false, error: "Location not found" };
        }

        await prisma.location.delete({
            where: { id },
        });

        // Revalidate pages that display location
        revalidatePath("/");
        revalidatePath("/contact");

        return { success: true, message: "Location deleted successfully" };
    } catch (error) {
        console.error("Failed to delete location:", error);
        return { success: false, error: "Failed to delete location" };
    }
}
