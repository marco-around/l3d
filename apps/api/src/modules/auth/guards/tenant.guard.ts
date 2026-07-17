import {
	BadRequestException,
	type CanActivate,
	type ExecutionContext,
	ForbiddenException,
	Inject,
	Injectable,
} from '@nestjs/common'
import {
	DRIZZLE_CONNECTION,
	type DrizzleDb,
	REDIS_CONNECTION,
} from '@src/shared/database/database.constants'
import type { FastifyRequest } from 'fastify'
import type Redis from 'ioredis'
import z from 'zod'

const tenantIdHeaderSchema = z.uuidv7()

const REDIS_PREFIX = 'tenant-member:'
const TENANT_MEMBER_TTL_SECONDS = 60

interface TenantMembership {
	role: 'ADMIN' | 'ANALYST'
}

export function tenantMembershipCacheKey(userId: string, tenantId: string): string {
	return `${REDIS_PREFIX}${userId}:${tenantId}`
}

@Injectable()
export class TenantGuard implements CanActivate {
	constructor(
		@Inject(DRIZZLE_CONNECTION) private readonly db: DrizzleDb,
		@Inject(REDIS_CONNECTION) private readonly redis: Redis
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<FastifyRequest>()

		const tenantIdHeader = request.headers['x-tenant-id']
		if (!tenantIdHeader || Array.isArray(tenantIdHeader)) {
			throw new BadRequestException('Header x-tenant-id ausente ou inválido')
		}
		const parsedTenantId = tenantIdHeaderSchema.safeParse(tenantIdHeader)
		if (!parsedTenantId.success) {
			throw new BadRequestException('Invalid tenant id')
		}
		const tenantId = parsedTenantId.data

		const membership = await this.getMembership(request.user.userId, tenantId)
		if (!membership) {
			throw new ForbiddenException('Usuário não pertence a este tenant')
		}

		request.tenant = { id: tenantId, role: membership.role }
		return true
	}

	private async getMembership(userId: string, tenantId: string): Promise<TenantMembership | null> {
		const key = tenantMembershipCacheKey(userId, tenantId)

		const cached = await this.redis.get(key)
		if (cached) {
			return JSON.parse(cached) as TenantMembership
		}

		const member = await this.db.query.tenantMembers.findFirst({
			columns: { role: true },
			where: { userId, tenantId },
		})

		if (!member) {
			return null
		}

		const membership: TenantMembership = { role: member.role }
		await this.redis.set(key, JSON.stringify(membership), 'EX', TENANT_MEMBER_TTL_SECONDS)

		return membership
	}
}
