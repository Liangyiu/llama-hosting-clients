import { REDIS_URI } from '$env/static/private';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const redisClient = new Redis(REDIS_URI, {
	enableOfflineQueue: false
});

// It is recommended to process Redis errors and setup some reconnection strategy
redisClient.on('error', (err) => {
	console.log(err);
});

export const rateLimit = {
	rateLimiterTest: new RateLimiterRedis({
		storeClient: redisClient,
		points: 1, // Number of points
		duration: 15, // Per second(s)

		keyPrefix: 'rl:test' // must be unique for limiters with different purpose
	})
};
