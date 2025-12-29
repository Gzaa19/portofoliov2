import { PrismaClient } from '@/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
    prismaClient: PrismaClient | undefined;
    pool: Pool | undefined;
};

function createPrismaClient() {
    if (!globalForPrisma.pool) {
        globalForPrisma.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
            max: 3,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
        });
    }

    const adapter = new PrismaPg(globalForPrisma.pool);
    return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prismaClient ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prismaClient = prisma;
}

export default prisma;

