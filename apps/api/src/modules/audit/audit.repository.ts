import { and, desc, eq, schema } from '@l3d/database'
import { Inject, Injectable } from '@nestjs/common'
import { DRIZZLE_CONNECTION, type DrizzleDb } from '@src/shared/database/database.constants'
import { CreateAuditLogDto } from './schemas/create-audit-log.schema'
import { QueryAuditLogDto } from './schemas/query-audit-log.schema'

@Injectable()
export class AuditRepository {
	constructor(@Inject(DRIZZLE_CONNECTION) private db: DrizzleDb) {}

	async log(payload: CreateAuditLogDto) {
		const [entry] = await this.db
			.insert(schema.auditLogs)
			.values({
				userId: payload.userId,
				tenantId: payload.tenantId,
				action: payload.action,
				metadata: payload.metadata,
			})
			.returning()

		return entry
	}

	async findAll(tenantId: string, query: QueryAuditLogDto) {
		const conditions = [eq(schema.auditLogs.tenantId, tenantId)]

		if (query.action) {
			conditions.push(eq(schema.auditLogs.action, query.action))
		}

		if (query.userId) {
			conditions.push(eq(schema.auditLogs.userId, query.userId))
		}

		return await this.db
			.select()
			.from(schema.auditLogs)
			.where(and(...conditions))
			.orderBy(desc(schema.auditLogs.createdAt))
			.limit(query.limit ?? 50)
			.offset(query.offset ?? 0)
	}

	async findOne(id: string, tenantId: string) {
		const [entry] = await this.db
			.select()
			.from(schema.auditLogs)
			.where(and(eq(schema.auditLogs.id, id), eq(schema.auditLogs.tenantId, tenantId)))

		return entry
	}
}
