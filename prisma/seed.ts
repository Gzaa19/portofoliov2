import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

// Initialize Prisma with adapter for Prisma 7
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Admin credentials
const adminData = {
    username: 'admin',
    password: 'admin123', // Will be hashed
    name: 'Administrator',
};

// Data projects untuk seeding
const projectsData = [
    {
        slug: "ecommerce-platform",
        title: "E-Commerce Platform",
        description: "A full-featured e-commerce platform built with Next.js, featuring product catalog, shopping cart, payment integration, and admin dashboard.",
        tags: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL"],
        link: "https://example.com",
        github: "https://github.com",
        featured: true,
        order: 1,
    },
    {
        slug: "task-management-app",
        title: "Task Management App",
        description: "Collaborative task management application with real-time updates, team collaboration features, and intuitive drag-and-drop interface.",
        tags: ["React", "Node.js", "Socket.io", "MongoDB"],
        link: "https://example.com",
        github: "https://github.com",
        featured: true,
        order: 2,
    },
    {
        slug: "ai-chat-assistant",
        title: "AI Chat Assistant",
        description: "Intelligent chatbot powered by machine learning, capable of natural language understanding and providing helpful responses.",
        tags: ["Python", "FastAPI", "OpenAI", "React"],
        github: "https://github.com",
        featured: true,
        order: 3,
    },
    {
        slug: "portfolio-website",
        title: "Portfolio Website",
        description: "Personal portfolio website showcasing projects and skills with modern design, smooth animations, and responsive layout.",
        tags: ["Next.js", "Framer Motion", "Tailwind CSS"],
        link: "https://example.com",
        github: "https://github.com",
        order: 4,
    },
    {
        slug: "weather-dashboard",
        title: "Weather Dashboard",
        description: "Beautiful weather dashboard displaying real-time weather data, forecasts, and interactive maps with location-based services.",
        tags: ["React", "Weather API", "Chart.js", "Geolocation"],
        link: "https://example.com",
        order: 5,
    },
    {
        slug: "social-media-app",
        title: "Social Media App",
        description: "Full-stack social media application with user authentication, posts, comments, likes, and real-time notifications.",
        tags: ["React Native", "Firebase", "Redux", "Expo"],
        github: "https://github.com",
        order: 6,
    },
];

// Social links data
const socialLinksData = [
    {
        name: "GitHub",
        username: "@Gzaa19",
        description: "Check out my open source projects and contributions",
        url: "https://github.com/Gzaa19",
        iconName: "GitHubIcon",
        iconBg: "bg-gray-800",
        order: 1,
    },
    {
        name: "LinkedIn",
        username: "Gaza Al Ghozali",
        description: "Connect with me professionally",
        url: "https://linkedin.com/in/gazaalghozali",
        iconName: "LinkedInIcon",
        iconBg: "bg-[#0A66C2]/10",
        order: 2,
    },
    {
        name: "Email",
        username: "gaza0alghozali@gmail.com",
        description: "Get in touch via email",
        url: "mailto:gaza0alghozali@gmail.com",
        iconName: "EmailIcon",
        iconBg: "bg-[#EA4335]/10",
        order: 3,
    },
    {
        name: "Instagram",
        username: "gazaa_chansaa",
        description: "Visit my personal Instagram profile",
        url: "https://instagram.com/gazaa_chansaa",
        iconName: "InstagramIcon",
        iconBg: "bg-gradient-to-br from-[#FFDC80]/10 via-[#F56040]/10 to-[#C13584]/10",
        order: 4,
    },
    {
        name: "Discord",
        username: "aizen.19",
        description: "Join me on Discord",
        url: "https://discord.com/users/aizen.19",
        iconName: "DiscordIcon",
        iconBg: "bg-[#5865F2]/10",
        order: 5,
    },
    {
        name: "Spotify",
        username: "Gaza Al Ghozali",
        description: "Listen to my Spotify playlists",
        url: "https://open.spotify.com/user/gazaalghozali",
        iconName: "SpotifyIcon",
        iconBg: "bg-[#1DB954]/10",
        order: 6,
    },
];

// Experience data (LinkedIn-style)
const experiencesData = [
    {
        companyName: "Tech Startup Inc.",
        companyLogo: null,
        companyUrl: "https://techstartup.example.com",
        title: "Full Stack Developer",
        employmentType: "full_time",
        location: "Jakarta, Indonesia",
        locationType: "hybrid",
        startDate: new Date("2023-06-01"),
        endDate: null,
        isCurrent: true,
        description: "• Leading the development of web applications using Next.js and React\n• Implementing RESTful APIs with Node.js and Express\n• Managing PostgreSQL databases and optimizing queries\n• Collaborating with cross-functional teams to deliver features",
        order: 1,
    },
    {
        companyName: "Digital Agency",
        companyLogo: null,
        companyUrl: "https://digitalagency.example.com",
        title: "Frontend Developer",
        employmentType: "full_time",
        location: "Bandung, Indonesia",
        locationType: "on_site",
        startDate: new Date("2022-01-15"),
        endDate: new Date("2023-05-31"),
        isCurrent: false,
        description: "• Developed responsive and interactive web interfaces\n• Worked with modern JavaScript frameworks including React and Vue.js\n• Implemented pixel-perfect designs from Figma mockups\n• Optimized website performance and loading times",
        order: 2,
    },
    {
        companyName: "Freelance",
        companyLogo: null,
        companyUrl: null,
        title: "Web Developer",
        employmentType: "freelance",
        location: null,
        locationType: "remote",
        startDate: new Date("2021-06-01"),
        endDate: new Date("2021-12-31"),
        isCurrent: false,
        description: "• Built custom websites for small businesses and individuals\n• Provided technical consultation and support\n• Managed multiple projects simultaneously with tight deadlines",
        order: 3,
    },
    {
        companyName: "University Tech Lab",
        companyLogo: null,
        companyUrl: null,
        title: "Web Development Intern",
        employmentType: "internship",
        location: "Bandung, Indonesia",
        locationType: "on_site",
        startDate: new Date("2021-01-01"),
        endDate: new Date("2021-05-31"),
        isCurrent: false,
        description: "• Assisted in developing internal web tools\n• Learned agile development methodologies\n• Participated in code reviews and team meetings",
        order: 4,
    },
];

// Helper function to create slug from name
function createSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
    console.log('🌱 Starting seed...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.experience.deleteMany();
    await prisma.projectTag.deleteMany();
    await prisma.project.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.socialLink.deleteMany();
    await prisma.admin.deleteMany();

    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    await prisma.admin.create({
        data: {
            username: adminData.username,
            password: hashedPassword,
            name: adminData.name,
        },
    });
    console.log(`   Admin created: ${adminData.username} / ${adminData.password}`);

    // Create tags first
    console.log('🏷️  Creating tags...');
    const allTags = [...new Set(projectsData.flatMap(p => p.tags))];

    for (const tagName of allTags) {
        await prisma.tag.create({
            data: {
                name: tagName,
                slug: createSlug(tagName),
            },
        });
    }

    // Create projects with tags
    console.log('📦 Creating projects...');
    for (const projectData of projectsData) {
        const { tags, ...projectFields } = projectData;

        await prisma.project.create({
            data: {
                ...projectFields,
                tags: {
                    create: tags.map(tagName => ({
                        tag: {
                            connect: {
                                slug: createSlug(tagName),
                            },
                        },
                    })),
                },
            },
        });
    }

    // Create social links
    console.log('🔗 Creating social links...');
    for (const socialLink of socialLinksData) {
        await prisma.socialLink.create({
            data: socialLink,
        });
    }

    // Create experiences
    console.log('💼 Creating experiences...');
    for (const experienceData of experiencesData) {
        await prisma.experience.create({
            data: experienceData,
        });
    }

    console.log('');
    console.log('✅ Seed completed successfully!');
    console.log('');
    console.log('📝 Admin Credentials:');
    console.log(`   Username: ${adminData.username}`);
    console.log(`   Password: ${adminData.password}`);
    console.log('');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
