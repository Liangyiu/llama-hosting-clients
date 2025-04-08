import { db } from '../db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, createAuthMiddleware, magicLink, openAPI } from 'better-auth/plugins';
import Redis from 'ioredis';
import { emailHarmony } from 'better-auth-harmony';
import { sendMail } from '../server/mail';
import { env } from '$env/dynamic/private';
import * as schema from '../db/schema';
import pbAdmin from '$lib/server/pb-admin';
import { Collections } from '$lib/types/pocketbase-types';

const redis = new Redis();

redis.on('error', (err) => {
	console.log('Redis Client Error:\n', err);
});

export const auth = betterAuth({
	appName: 'llama hosting Client Portal',
	baseURL: env.BASE_URL || env.ORIGIN,
	database: drizzleAdapter(db, { provider: 'sqlite', schema }),
	secondaryStorage: {
		get: async (key) => {
			const value = await redis.get(`better-auth:${key}`);
			return value ? value : null;
		},
		set: async (key, value, ttl) => {
			if (ttl) await redis.set(`better-auth:${key}`, value, 'EX', ttl);
			else await redis.set(key, value);
		},
		delete: async (key) => {
			await redis.del(`better-auth:${key}`);
		}
	},
	databaseHooks: {
		user: {
			create: {
				after: async (user) => {
					await pbAdmin.collection(Collections.UserDetails).create({
						id: user.id
					});
				}
			}
		}
	},
	plugins: [
		openAPI(),
		admin(),
		emailHarmony(),
		magicLink({
			sendMagicLink: async ({ email, url }) => {
				await sendMail({
					from: env.SMTP_FROM!,
					to: email,
					subject: 'Authentication via Magic Link',
					text: `Click the link to log in: ${url}`
				});
			}
		})
	]
});
