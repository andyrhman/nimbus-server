import { PrismaClient } from '@prisma/client';
import { rateLimiter } from './rateLimiter.config';

export const myPrisma = new PrismaClient();

// Prisma middleware for rate limiting
myPrisma.$use(async (params, next) => {
  try {
    // Extract identifier for rate limiting (e.g., from a custom header or user context)
    const identifier = params.args?.requester || 'default';
    
    // Consume a point for the identifier
    await rateLimiter.consume(identifier);

    // Proceed with the query
    return await next(params);
  } catch (rateLimiterRes) {
    // Handle rate-limiting errors
    throw new Error('Too many requests - rate limited');
  }
});
