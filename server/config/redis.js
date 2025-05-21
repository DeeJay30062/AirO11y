// server/config/redis.js
// 

import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', err => console.error('Redis Error:', err));

await redisClient.connect(); // Top-level await is valid in ESM

console.log('[✓] Redis connected');
export default redisClient;
