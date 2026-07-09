import { db, schema } from '@l3d/database'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { openAPI } from 'better-auth/plugins'

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema,
	}),
	plugins: [
		openAPI({
			disableDefaultReference: true,
		}),
	],
	emailAndPassword: { enabled: true },
})
