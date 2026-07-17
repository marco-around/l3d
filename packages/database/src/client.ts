import { drizzle } from 'drizzle-orm/node-postgres'
import { relations } from './db/relations'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
	throw new Error('DATABASE_URL is not set')
}

export const db = drizzle({
	connection: {
		connectionString: databaseUrl,
		max: 10,
		ssl: process.env.NODE_ENV === 'production',
	},
	relations,
})
