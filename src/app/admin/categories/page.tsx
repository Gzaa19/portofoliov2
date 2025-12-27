import prisma from "@/lib/prisma";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

async function getCategories() {
    const categories = await prisma.projectCategory.findMany({
        include: {
            _count: {
                select: { projects: true },
            },
        },
        orderBy: [
            { order: 'asc' },
            { name: 'asc' },
        ],
    });

    return categories;
}

export default async function AdminCategoriesPage() {
    const categories = await getCategories();

    return <CategoriesManager initialCategories={categories} />;
}
