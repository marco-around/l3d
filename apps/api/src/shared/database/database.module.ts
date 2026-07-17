import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common'
import type Redis from 'ioredis'
import { DRIZZLE_CONNECTION, type DrizzleDb, REDIS_CONNECTION } from './database.constants'
import { databaseProviders } from './database.providers'

@Global()
@Module({
	providers: [...databaseProviders],
	exports: [...databaseProviders],
})
export class DatabaseModule implements OnApplicationShutdown {
	constructor(
		@Inject(DRIZZLE_CONNECTION) private readonly db: DrizzleDb,
		@Inject(REDIS_CONNECTION) private readonly redis: Redis
	) {}

	async onApplicationShutdown() {
		await this.db.$client.end()
		await this.redis.quit()
	}
}
