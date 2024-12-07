import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import { routes } from './routes';
import { ValidationMiddleware } from './middleware/validation.middleware';
import { createClient } from 'redis';
import { RateLimiterMiddleware } from './middleware/rateLimiter.middleware';
import { connectRedis } from './config/redisClient.config';

dotenv.config();

const app = express();

export const client = createClient({
    url: process.env.REDIS_URL
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        callback(null, true);
    }
}));
app.use(RateLimiterMiddleware);
app.use(ValidationMiddleware);

axios.defaults.baseURL = process.env.ML_ENDPOINT;

routes(app);

(async () => {
    try {
        await connectRedis();
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
})();

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! Continuing...');
    console.error(err);
});

process.on('unhandledRejection', (err: any) => {
    console.error('UNHANDLED REJECTION! Continuing...');
    console.error(err);
    app.use((req, res, next) => {
        next(err);
    });
});
