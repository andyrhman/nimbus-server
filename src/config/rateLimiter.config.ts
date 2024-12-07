import { RateLimiterRedis } from 'rate-limiter-flexible';
import { client } from './redisClient.config';

const rateLimiter = new RateLimiterRedis({
    storeClient: client,
    keyPrefix: 'rateLimiter',
    points: 10, // Number of points
    duration: 60, // Per 60 seconds
    blockDuration: 1800, // Block for 5 minutes if consumed more than allowed points
});

export { rateLimiter };
