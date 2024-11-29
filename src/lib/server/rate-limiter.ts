import { REDIS_URI } from '$env/static/private';
import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible';
import { createClient } from 'redis';

const redis = createClient({
	url: REDIS_URI
});

redis.on('error', (err) => {
	console.log('Redis Client Error:\n', err);
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
	}),
	avatarUpload: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 1, // Number of points
		duration: 30, // Per second(s)
		useRedisPackage: true,
		keyPrefix: 'rl:avatar:upload' // must be unique for limiters with different purpose
	}),
	avatarDelete: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 1, // Number of points
		duration: 30, // Per second(s)
		useRedisPackage: true,
		keyPrefix: 'rl:avatar:delete' // must be unique for limiters with different purpose
	}),
	accountDetailsUpdate: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 1, // Number of points
		duration: 15, // Per second(s)
		useRedisPackage: true,
		keyPrefix: 'rl:accountdetails:update' // must be unique for limiters with different purpose
	}),
	emailChange: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 1, // Number of points
		duration: 60, // Per second(s)
		useRedisPackage: true,
		keyPrefix: 'rl:email:change' // must be unique for limiters with different purpose
	}),
	passwordReset: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 1, // Number of points
		duration: 60, // Per second(s)
		useRedisPackage: true,
		keyPrefix: 'rl:password:reset' // must be unique for limiters with different purpose
	}),
	activateTotp: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 1, // Number of points
		duration: 10, // Per second(s)
		useRedisPackage: true,
		keyPrefix: 'rl:totp:activate' // must be unique for limiters with different purpose
	}),
	deactivateTotp: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 1, // Number of points
		duration: 10, // Per second(s)
		useRedisPackage: true,
		keyPrefix: 'rl:totp:deactivate' // must be unique for limiters with different purpose
	}),
	validateTotpCode: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 1, // Number of points
		duration: 5, // Per second(s)
		useRedisPackage: true,
		keyPrefix: 'rl:totp:validate' // must be unique for limiters with different purpose
	}),
	loginEmail: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 3, // Number of points
		duration: 10, // Per second(s)
		useRedisPackage: true,
		keyPrefix: 'rl:login:email' // must be unique for limiters with different purpose
	})
};
