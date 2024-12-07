import { Request, Response, NextFunction } from 'express';
import { rateLimiter } from '../config/rateLimiter.config';

export const RateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Consume 1 point for each request
    await rateLimiter.consume(req.ip);
    next(); // Allow the request if the rate limit is not exceeded
  } catch (rateLimiterRes) {
    res.status(429).json({
      message: 'Too Many Requests. Please try again later.',
    });
  }
};
