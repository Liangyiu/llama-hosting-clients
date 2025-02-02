import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import Redis from 'ioredis';

export const redis = new Redis(dev ? env.REDIS_DEV_URI : env.REDIS_URI);

redis.on('error', (err) => {
	console.log('Redis Client Error:\n', err);
});