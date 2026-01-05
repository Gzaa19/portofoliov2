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

async function main() {
    console.log('🌱 Starting seed...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
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
