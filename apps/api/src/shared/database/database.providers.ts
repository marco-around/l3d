import { db } from '@l3d/database'
import type { Provider } from '@nestjs/common'
import { DRIZZLE_CONNECTION } from './database.constants'

export const databaseProviders: Provider[] = [
	{
		provide: DRIZZLE_CONNECTION,
		useFactory: () => db,
	},
]
