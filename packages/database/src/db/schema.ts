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

export const auditActionEnum = pgEnum('audit_action', ['CREATE', 'UPDATE', 'DELETE', 'READ'])

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
		metadata: jsonb('metadata'),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [index('audit_logs_tenant_id_index').on(table.tenantId)]
)

export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'ANALYST'])

export const users = pgTable(
	'users',
	{
		id: uuid('id').primaryKey().notNull().default(sql`uuidv7()`),
		tenantId: uuid('tenant_id')
			.notNull()
			.references(() => tenants.id),
		name: text('name').notNull(),
		email: text('email').notNull(),
		passwordHash: text('password_hash').notNull(),
		role: userRoleEnum('role').notNull().default('ANALYST'),
		deletedAt: timestamp('deleted_at', { withTimezone: true }),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		uniqueIndex('users_tenant_email_unique').on(table.tenantId, table.email),
		index('users_tenant_id_index').on(table.tenantId),
	]
)
