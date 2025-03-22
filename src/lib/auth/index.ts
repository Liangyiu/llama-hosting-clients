import { db } from '../db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import Redis from 'ioredis';

const redis = new Redis();

redis.on('error', (err) => {
	console.log('Redis Client Error:\n', err);
});

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: 'sqlite' }),
	emailAndPassword: {
		enabled: true
	},
	secondaryStorage: {
		get: async (key) => {
			const value = await redis.get(key);
			return value ? value : null;
		},
		set: async (key, value, ttl) => {
			if (ttl) await redis.set(key, value, 'EX', ttl);
			else await redis.set(key, value);
		},
		delete: async (key) => {
			await redis.del(key);
		}
	},
	plugins: [admin()]
});
