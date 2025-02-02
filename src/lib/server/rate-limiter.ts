import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible';
import { redis } from '$lib/server/redis';


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
		keyPrefix: 'rl:sshkey:add' // must be unique for limiters with different purpose
	}),
	sshKeyDelete: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 3,
		duration: 10,
		keyPrefix: 'rl:sshkey:delete'
	}),
	sshKeyDefaultAdd: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 3,
		duration: 10,
		keyPrefix: 'rl:sshkey:default:add'
	}),
	sshKeyDefaultRemove: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 3,
		duration: 10,
		keyPrefix: 'rl:sshkey:default:remove'
	}),
	avatarUpload: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 1,
		duration: 30,
		keyPrefix: 'rl:avatar:upload'
	}),
	avatarDelete: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 1,
		duration: 30,
		keyPrefix: 'rl:avatar:delete'
	}),
	accountDetailsUpdate: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 1,
		duration: 15,
		keyPrefix: 'rl:accountdetails:update'
	}),
	emailChange: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 1,
		duration: 60,
		keyPrefix: 'rl:email:change'
	}),
	passwordReset: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 1,
		duration: 60,
		keyPrefix: 'rl:password:reset'
	}),
	activateTotp: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 1,
		duration: 10,
		keyPrefix: 'rl:totp:activate'
	}),
	deactivateTotp: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 1,
		duration: 10,
		keyPrefix: 'rl:totp:deactivate'
	}),
	validateTotpCode: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 1,
		duration: 5,
		keyPrefix: 'rl:totp:validate'
	}),
	loginEmail: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 3,
		duration: 10,
		keyPrefix: 'rl:login:email'
	}),
	loginIp: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 3,
		duration: 10,
		keyPrefix: 'rl:login:ip'
	}),
	loginEmailIp: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 3,
		duration: 10,
		keyPrefix: 'rl:login:emailip'
	}),
	healthCheck: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 2,
		duration: 1,
		keyPrefix: 'rl:healthcheck'
	}),
	registerIp: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 1,
		duration: 5,
		keyPrefix: 'rl:register:ip'
	}),
	createTicketMessage: new extendedRateLimiterRedis({
		storeClient: redis,
		points: 1,
		duration: 10,
		keyPrefix: 'rl:create:ticket'
	})
};
