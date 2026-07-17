import { sql } from 'drizzle-orm'
import {
	index,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from 'drizzle-orm/pg-core'

export const tenants = pgTable('tenants', {
	id: uuid('id').primaryKey().notNull().default(sql`uuidv7()`),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	deletedAt: timestamp('deleted_at', { withTimezone: true }),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const users = pgTable(
	'users',
	{
		id: uuid('id').primaryKey().notNull().default(sql`uuidv7()`),
		name: text('name').notNull(),
		email: text('email').notNull(),
		passwordHash: text('password_hash').notNull(),
		deletedAt: timestamp('deleted_at', { withTimezone: true }),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [uniqueIndex('users_email_unique').on(table.email).where(sql`deleted_at IS NULL`)]
)

export const memberRoleEnum = pgEnum('member_role', ['ADMIN', 'ANALYST'])

export const tenantMembers = pgTable(
	'tenant_members',
	{
		id: uuid('id').primaryKey().notNull().default(sql`uuidv7()`),
		tenantId: uuid('tenant_id')
			.notNull()
			.references(() => tenants.id),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id),
		role: memberRoleEnum('role').notNull().default('ANALYST'),
		deletedAt: timestamp('deleted_at', { withTimezone: true }),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		uniqueIndex('tenant_members_tenant_user_unique')
			.on(table.tenantId, table.userId)
			.where(sql`deleted_at IS NULL`),
		index('tenant_members_tenant_id_index').on(table.tenantId),
		index('tenant_members_user_id_index').on(table.userId),
	]
)

export const auditActionEnum = pgEnum('audit_action', ['CREATE', 'UPDATE', 'DELETE'])

export const auditLogs = pgTable(
	'audit_logs',
	{
		id: uuid('id').primaryKey().notNull().default(sql`uuidv7()`),
		tenantId: uuid('tenant_id')
			.notNull()
			.references(() => tenants.id),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id),
		action: auditActionEnum('action').notNull(),
		entity: text('entity').notNull(),
		entityId: uuid('entity_id').notNull(),
		metadata: jsonb('metadata'),
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index('audit_logs_tenant_id_index').on(table.tenantId),
		index('audit_logs_user_id_index').on(table.userId),
		index('audit_logs_entity_index').on(table.entity, table.entityId),
	]
)

export const sessions = pgTable(
	'sessions',
	{
		id: uuid('id').primaryKey().notNull().default(sql`uuidv7()`),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id),
		tokenHash: text('token_hash').notNull().unique(),
		userAgent: text('user_agent'),
		ipAddress: text('ip_address'),
		expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
		revokedAt: timestamp('revoked_at', { withTimezone: true }),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [index('sessions_user_id_index').on(table.userId)]
)

export const invitationStatusEnum = pgEnum('invitation_status', [
	'PENDING',
	'ACCEPTED',
	'EXPIRED',
	'REVOKED',
])

export const invitations = pgTable('invitations', {
	id: uuid('id').primaryKey().default(sql`uuidv7()`),
	tenantId: uuid('tenant_id')
		.notNull()
		.references(() => tenants.id),
	invitedByUserId: uuid('invited_by_user_id')
		.notNull()
		.references(() => users.id),
	email: text('email').notNull(),
	role: memberRoleEnum('role').notNull().default('ANALYST'),
	token: text('token').notNull().unique(),
	status: invitationStatusEnum('status').notNull().default('PENDING'),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
	acceptedAt: timestamp('accepted_at', { withTimezone: true }),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
