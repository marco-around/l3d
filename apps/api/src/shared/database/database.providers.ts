import { db } from '@l3d/database/client'
import type { Provider } from '@nestjs/common'
import Redis from 'ioredis'
import { DRIZZLE_CONNECTION, REDIS_CONNECTION } from './database.constants'

export const databaseProviders: Provider[] = [
	{
		provide: DRIZZLE_CONNECTION,
		useValue: db,
	},
	{
		provide: REDIS_CONNECTION,
		useFactory: () =>
			new Redis({
				host: process.env.REDIS_HOST ?? 'localhost',
				port: Number(process.env.REDIS_PORT ?? 6379),
				password: process.env.REDIS_PASSWORD,
				enableAutoPipelining: true,
			}),
	},
]
