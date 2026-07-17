import { createHash, randomBytes } from 'node:crypto'
import { and, eq, isNull, sessions } from '@l3d/database'
import { Inject, Injectable } from '@nestjs/common'
import {
	DRIZZLE_CONNECTION,
	type DrizzleDb,
	REDIS_CONNECTION,
} from '@src/shared/database/database.constants'
import type Redis from 'ioredis'

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days
const REDIS_PREFIX = 'session:'

export interface SessionPayload {
	sessionId: string
	userId: string
}

export interface SessionMeta {
	userAgent?: string
	ipAddress?: string
}

export interface CreatedSession {
	token: string
	sessionId: string
	expiresAt: Date
}
function hashToken(rawToken: string): string {
	return createHash('sha256').update(rawToken).digest('hex')
}

function redisKey(tokenHash: string): string {
	return `${REDIS_PREFIX}${tokenHash}`
}

@Injectable()
export class SessionService {
	constructor(
		@Inject(DRIZZLE_CONNECTION) private readonly db: DrizzleDb,
		@Inject(REDIS_CONNECTION) private readonly redis: Redis
	) {}

	async create(userId: string, meta?: SessionMeta): Promise<CreatedSession> {
		const rawToken = randomBytes(32).toString('base64url')
		const tokenHash = hashToken(rawToken)
		const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000)

		const [session] = await this.db
			.insert(sessions)
			.values({
				userId,
				tokenHash,
				expiresAt,
				userAgent: meta?.userAgent,
				ipAddress: meta?.ipAddress,
			})
			.returning({ id: sessions.id })

		const payload: SessionPayload = { sessionId: session.id, userId }

		await this.redis.set(redisKey(tokenHash), JSON.stringify(payload), 'EX', SESSION_TTL_SECONDS)

		return { token: rawToken, sessionId: session.id, expiresAt }
	}

	async validate(rawToken: string): Promise<SessionPayload | null> {
		const tokenHash = hashToken(rawToken)
		const key = redisKey(tokenHash)

		const cached = await this.redis.get(key)
		if (cached) {
			return JSON.parse(cached) as SessionPayload
		}

		const session = await this.db.query.sessions.findFirst({
			columns: {
				id: true,
				userId: true,
				expiresAt: true,
			},
			where: {
				tokenHash,
				expiresAt: { gt: new Date() },
				revokedAt: { isNull: true },
			},
		})

		if (!session) {
			return null
		}

		const payload: SessionPayload = {
			sessionId: session.id,
			userId: session.userId,
		}

		const remainingTtl = Math.floor((session.expiresAt.getTime() - Date.now()) / 1000)
		if (remainingTtl > 0) {
			await this.redis.set(key, JSON.stringify(payload), 'EX', remainingTtl)
		}

		return payload
	}

	async revoke(rawToken: string): Promise<void> {
		const tokenHash = hashToken(rawToken)

		await Promise.all([
			this.redis.del(redisKey(tokenHash)),
			this.db
				.update(sessions)
				.set({ revokedAt: new Date() })
				.where(eq(sessions.tokenHash, tokenHash)),
		])
	}

	async revokeAllForUser(userId: string): Promise<void> {
		const activeSessions = await this.db
			.select({ tokenHash: sessions.tokenHash })
			.from(sessions)
			.where(and(eq(sessions.userId, userId), isNull(sessions.revokedAt)))

		await this.db
			.update(sessions)
			.set({ revokedAt: new Date() })
			.where(and(eq(sessions.userId, userId), isNull(sessions.revokedAt)))

		if (activeSessions.length > 0) {
			const keys = activeSessions.map((s) => redisKey(s.tokenHash))
			await this.redis.del(...keys)
		}
	}
}
