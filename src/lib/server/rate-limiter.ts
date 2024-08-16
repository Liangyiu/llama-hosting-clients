import { REDIS_URI } from '$env/static/private';
import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible';
import { createClient } from 'redis';
import * as Sentry from '@sentry/sveltekit';
import { PUBLIC_GLITCHTOP_DSN_DEV, PUBLIC_GLITCHTOP_DSN_PROD } from '$env/static/public';
import { dev } from '$app/environment';

const redis = createClient({
	url: REDIS_URI
});

Sentry.init({
	dsn: dev ? PUBLIC_GLITCHTOP_DSN_DEV : PUBLIC_GLITCHTOP_DSN_PROD,
	tracesSampleRate: 1
});

redis.on('error', (err) => {
	Sentry.captureException(err, {
		contexts: {
			redis: {
				time: new Date().toUTCString()
			}
		}
	});
});

if (!redis.isOpen) {
	await redis.connect();
}

class extendedRateLimiterRedis extends RateLimiterRedis {
	async limit(key: string | number) {
		try {
			const rlRes: RateLimiterRes = await this.consume(key, 1);
			return {
				success: true,
				timeRemaining: Math.floor(rlRes.msBeforeNext / 1000)
			};
		} catch (err) {
			const { msBeforeNext } = err as RateLimiterRes;

			return {
				success: false,
				timeRemaining: Math.floor(msBeforeNext / 1000)
			};
		}
	}
}

export const rateLimiters = {
	sshKeyAdd: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 3, // Number of points
		duration: 10, // Per second(s)
		useRedisPackage: true,
		keyPrefix: 'rl:sshkey:add' // must be unique for limiters with different purpose
	}),
	sshKeyDelete: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 3, // Number of points
		duration: 10, // Per second(s)
		useRedisPackage: true,
		keyPrefix: 'rl:sshkey:delete' // must be unique for limiters with different purpose
	}),
	sshKeyDefaultAdd: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 3, // Number of points
		duration: 10, // Per second(s)
		useRedisPackage: true,
		keyPrefix: 'rl:sshkey:default:add' // must be unique for limiters with different purpose
	}),
	sshKeyDefaultRemove: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 3, // Number of points
		duration: 10, // Per second(s)
		useRedisPackage: true,
		keyPrefix: 'rl:sshkey:default:remove' // must be unique for limiters with different purpose
	})
};
