import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { AuthController } from './auth.controller'
import { AuthRepository } from './auth.repository'
import { AuthService } from './auth.service'
import { AuthGuard } from './guards/auth.guard'
import { HashService } from './hash.service'
import { SessionService } from './session.service'

@Module({
	controllers: [AuthController],
	providers: [
		AuthService,
		AuthRepository,
		HashService,
		SessionService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
	exports: [AuthService, SessionService],
})
export class AuthModule {}
