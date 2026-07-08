import { defineRelations } from 'drizzle-orm'
import * as schema from './schema'

export const relations = defineRelations(schema, (relation) => ({
	tenants: {
		users: relation.many.users(),
		auditLogs: relation.many.auditLogs(),
	},

	users: {
		tenant: relation.one.tenants({
			from: relation.users.tenantId,
			to: relation.tenants.id,
		}),
		auditLogs: relation.many.auditLogs(),
	},

	auditLogs: {
		tenant: relation.one.tenants({
			from: relation.auditLogs.tenantId,
			to: relation.tenants.id,
		}),
		user: relation.one.users({
			from: relation.auditLogs.userId,
			to: relation.users.id,
		}),
	},
}))
