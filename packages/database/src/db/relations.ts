import { defineRelations } from 'drizzle-orm'
import * as schema from './schema'

export const relations = defineRelations(schema, (relation) => ({
	tenants: {
		members: relation.many.tenantMembers(),
		auditLogs: relation.many.auditLogs(),
		invitations: relation.many.invitations(),
	},

	users: {
		memberships: relation.many.tenantMembers(),
		auditLogs: relation.many.auditLogs(),
		sessions: relation.many.sessions(),
		invitations: relation.many.invitations(),
	},

	tenantMembers: {
		tenant: relation.one.tenants({
			from: relation.tenantMembers.tenantId,
			to: relation.tenants.id,
		}),
		user: relation.one.users({
			from: relation.tenantMembers.userId,
			to: relation.users.id,
		}),
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

	invitations: {
		tenant: relation.one.tenants({
			from: relation.invitations.tenantId,
			to: relation.tenants.id,
		}),
		invitedByUser: relation.one.users({
			from: relation.invitations.invitedByUserId,
			to: relation.users.id,
		}),
	},
}))
