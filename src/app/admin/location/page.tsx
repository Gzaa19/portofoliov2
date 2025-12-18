import prisma from "@/lib/prisma";
import { LocationManager } from "@/components/admin";


async function getLocation() {
    const location = await prisma.location.findFirst({
        where: { isActive: true },
    });

    if (!location) return null;

    return {
        id: location.id,
        name: location.name,
        address: location.address ?? undefined,
        latitude: location.latitude,
        longitude: location.longitude,
        zoom: location.zoom,
        isActive: location.isActive,
    };
}

export default async function AdminLocationPage() {
    const location = await getLocation();

    return <LocationManager initialLocation={location} />;
}
