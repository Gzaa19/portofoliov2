import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const seedData = [
    {
        name: "Programming Languages",
        order: 0,
        items: [
            { name: "HTML5", iconName: "SiHtml5", color: "#E34F26", order: 0 },
            { name: "CSS3", iconName: "SiCss3", color: "#1572B6", order: 1 },
            { name: "JavaScript", iconName: "SiJavascript", color: "#F7DF1E", order: 2 },
            { name: "TypeScript", iconName: "SiTypescript", color: "#3178C6", order: 3 },
            { name: "PHP", iconName: "SiPhp", color: "#777BB4", order: 4 },
            { name: "Python", iconName: "SiPython", color: "#3776AB", order: 5 },
            { name: "C", iconName: "SiC", color: "#A8B9CC", order: 6 },
        ],
    },
    {
        name: "Frameworks & Libraries",
        order: 1,
        items: [
            { name: "React", iconName: "SiReact", color: "#61DAFB", order: 0 },
            { name: "Next.js", iconName: "SiNextdotjs", color: "#FFFFFF", order: 1 },
            { name: "Node.js", iconName: "SiNodedotjs", color: "#339933", order: 2 },
            { name: "Express.js", iconName: "SiExpress", color: "#FFFFFF", order: 3 },
            { name: "Laravel", iconName: "SiLaravel", color: "#FF2D20", order: 4 },
            { name: "Tailwind CSS", iconName: "SiTailwindcss", color: "#06B6D4", order: 5 },
        ],
    },
    {
        name: "Databases & Tools",
        order: 2,
        items: [
            { name: "MongoDB", iconName: "SiMongodb", color: "#47A248", order: 0 },
            { name: "PostgreSQL", iconName: "SiPostgresql", color: "#336791", order: 1 },
            { name: "MySQL", iconName: "SiMysql", color: "#4479A1", order: 2 },
            { name: "Docker", iconName: "SiDocker", color: "#2496ED", order: 3 },
            { name: "Git", iconName: "SiGit", color: "#F05032", order: 4 },
            { name: "Google Colab", iconName: "SiGooglecolab", color: "#F9AB00", order: 5 },
            { name: "Railway", iconName: "SiRailway", color: "#FFFFFF", order: 6 },
        ],
    },
];

// POST - Seed default toolbox data
export async function POST() {
    try {
        // Check if data already exists
        const existingCategories = await prisma.toolboxCategory.count();
        if (existingCategories > 0) {
            return NextResponse.json({ error: "Toolbox data already exists" }, { status: 400 });
        }

        // Seed data
        for (const category of seedData) {
            await prisma.toolboxCategory.create({
                data: {
                    name: category.name,
                    order: category.order,
                    items: {
                        create: category.items,
                    },
                },
            });
        }

        return NextResponse.json({ success: true, message: "Toolbox data seeded successfully" });
    } catch (error) {
        console.error("Failed to seed toolbox:", error);
        return NextResponse.json({ error: "Failed to seed toolbox" }, { status: 500 });
    }
}
