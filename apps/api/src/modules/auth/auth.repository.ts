import { and, eq, isNull, tenantMembers, tenants, users } from '@l3d/database'
import { Inject, Injectable } from '@nestjs/common'
import { DRIZZLE_CONNECTION, type DrizzleDb } from '@src/shared/database/database.constants'

@Injectable()
export class AuthRepository {
	constructor(@Inject(DRIZZLE_CONNECTION) private db: DrizzleDb) {}

	async findByEmail(email: string) {
		const user = await this.db.query.users.findFirst({
			where: {
				email,
				deletedAt: { isNull: true },
			},
		})

		return user ?? null
	}

	async findById(id: string) {
		const user = await this.db.query.users.findFirst({
			where: {
				id,
				deletedAt: { isNull: true },
			},
			columns: {
				id: true,
				name: true,
				email: true,
				createdAt: true,
				updatedAt: true,
			},
		})

		return user ?? null
	}

	async create(data: { name: string; email: string; passwordHash: string }) {
		const [user] = await this.db.insert(users).values(data).returning({
			id: users.id,
			name: users.name,
			email: users.email,
			createdAt: users.createdAt,
			updatedAt: users.updatedAt,
		})

		return user
	}

	async findTenantsByUserId(userId: string) {
		return this.db
			.select({
				id: tenants.id,
				name: tenants.name,
				slug: tenants.slug,
				role: tenantMembers.role,
			})
			.from(tenantMembers)
			.innerJoin(tenants, eq(tenantMembers.tenantId, tenants.id))
			.where(
				and(
					eq(tenantMembers.userId, userId),
					isNull(tenantMembers.deletedAt),
					isNull(tenants.deletedAt)
				)
			)
	}
}
