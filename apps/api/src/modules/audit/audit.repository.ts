import { and, auditLogs, desc, eq } from '@l3d/database'
import { Inject, Injectable } from '@nestjs/common'
import { DRIZZLE_CONNECTION, type DrizzleDb } from '@src/shared/database/database.constants'
import { CreateAudit } from './schemas/create-audit-log.schema'
import { QueryAuditLog } from './schemas/query-audit-log.schema'

@Injectable()
export class AuditRepository {
	constructor(@Inject(DRIZZLE_CONNECTION) private db: DrizzleDb) {}

	async log(payload: CreateAudit) {
		const [entry] = await this.db
			.insert(auditLogs)
			.values({
				userId: payload.userId,
				tenantId: payload.tenantId,
				action: payload.action,
				entity: payload.entity,
				entityId: payload.entityId,
				ipAddress: payload.ipAddress,
				userAgent: payload.userAgent,
				metadata: payload.metadata,
			})
			.returning()

		return entry
	}

	async findAll(tenantId: string, query: QueryAuditLog) {
		const conditions = [eq(auditLogs.tenantId, tenantId)]

		if (query.action) {
			conditions.push(eq(auditLogs.action, query.action))
		}

		if (query.userId) {
			conditions.push(eq(auditLogs.userId, query.userId))
		}

		return await this.db
			.select()
			.from(auditLogs)
			.where(and(...conditions))
			.orderBy(desc(auditLogs.createdAt))
			.limit(query.limit ?? 50)
			.offset(query.offset ?? 0)
	}

	async findOne(id: string, tenantId: string) {
		const [entry] = await this.db
			.select()
			.from(auditLogs)
			.where(and(eq(auditLogs.id, id), eq(auditLogs.tenantId, tenantId)))

		return entry
	}
}
