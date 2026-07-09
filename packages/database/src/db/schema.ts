import { sql } from 'drizzle-orm'
import {
	boolean,
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
		emailVerified: boolean('email_verified').notNull().default(false),
		image: text('image'),
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

export const sessions = pgTable(
	'sessions',
	{
		id: uuid('id').primaryKey().notNull().default(sql`uuidv7()`),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id),
		token: text('token').notNull().unique(),
		expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [index('sessions_user_id_index').on(table.userId)]
)

export const accounts = pgTable(
	'accounts',
	{
		id: uuid('id').primaryKey().notNull().default(sql`uuidv7()`),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id),
		accountId: text('account_id').notNull(),
		providerId: text('provider_id').notNull(),
		accessToken: text('access_token'),
		refreshToken: text('refresh_token'),
		idToken: text('id_token'),
		accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
		refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
		scope: text('scope'),
		password: text('password'),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [index('accounts_user_id_index').on(table.userId)]
)

export const verifications = pgTable('verifications', {
	id: uuid('id').primaryKey().notNull().default(sql`uuidv7()`),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})
