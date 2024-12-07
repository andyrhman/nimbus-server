import { createClient } from 'redis';

const client = createClient({
    url: process.env.REDIS_URL,
});

client.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

export const connectRedis = async () => {
    if (!client.isOpen) {
        await client.connect();
        console.log('Connected to Redis');
    }
};

export { client };
