import { tenantMembers, tenants } from '@l3d/database'
import { Inject, Injectable } from '@nestjs/common'
import { DRIZZLE_CONNECTION, type DrizzleDb } from '@src/shared/database/database.constants'

@Injectable()
export class TenantsRepository {
	constructor(@Inject(DRIZZLE_CONNECTION) private readonly db: DrizzleDb) {}

	async findBySlug(slug: string) {
		const tenant = await this.db.query.tenants.findFirst({
			where: {
				slug,
				deletedAt: { isNull: true },
			},
		})

		return tenant ?? null
	}

	async createWithAdmin(data: { name: string; slug: string }, userId: string) {
		return this.db.transaction(async (transaction) => {
			const [tenant] = await transaction
				.insert(tenants)
				.values({ name: data.name, slug: data.slug })
				.returning()

			await transaction.insert(tenantMembers).values({
				userId,
				tenantId: tenant.id,
				role: 'ADMIN',
			})

			return tenant
		})
	}
}
