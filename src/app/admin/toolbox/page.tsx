import prisma from "@/lib/prisma";
import { ToolboxManager } from "@/components/admin";

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

async function getToolboxCategories() {
    const categories = await prisma.toolboxCategory.findMany({
        include: {
            items: {
                orderBy: { order: 'asc' },
            },
        },
        orderBy: { order: 'asc' },
    });

    return categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        order: cat.order,
        isActive: cat.isActive,
        items: cat.items.map((item) => ({
            id: item.id,
            name: item.name,
            iconName: item.iconName,
            color: item.color,
            order: item.order,
            isActive: item.isActive,
            categoryId: item.categoryId,
        })),
    }));
}

export default async function AdminToolboxPage() {
    const categories = await getToolboxCategories();

    return <ToolboxManager initialCategories={categories} />;
}
