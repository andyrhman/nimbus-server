import { RateLimiterPrisma } from 'rate-limiter-flexible';
import { myPrisma } from './db.config'; // Your PrismaClient instance

// Configure the Prisma rate limiter
const prismaRateLimiter = new RateLimiterPrisma({
    storeClient: myPrisma,
    points: 10, // Number of allowed operations
    duration: 60, // Per 60 seconds
    blockDuration: 300, // Block for 5 minutes if exceeded
});

export { prismaRateLimiter };
