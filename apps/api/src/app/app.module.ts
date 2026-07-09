import { Module } from '@nestjs/common'
import { auth } from '@src/shared/config/auth'
import { DatabaseModule } from '@src/shared/database/database.module'
import { AuthModule } from '@thallesp/nestjs-better-auth'

@Module({
	imports: [
		DatabaseModule,
		AuthModule.forRoot({
			auth,
			bodyParser: {
				json: { limit: '2mb' },
				urlencoded: { limit: '2mb', extended: true },
				rawBody: true,
			},
		}),
	],
})
export class AppModule {}
