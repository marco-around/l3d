import { resolve } from 'node:path'
import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: resolve(__dirname, '../../.env') })

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
	throw new Error('DATABASE_URL is not set')
}

export default defineConfig({
	out: './drizzle',
	schema: './src/db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: databaseUrl,
	},
})
