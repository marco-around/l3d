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
		sessions: relation.many.sessions(),
		accounts: relation.many.accounts(),
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

	sessions: {
		user: relation.one.users({
			from: relation.sessions.userId,
			to: relation.users.id,
		}),
	},

	accounts: {
		user: relation.one.users({
			from: relation.accounts.userId,
			to: relation.users.id,
		}),
	},
}))
