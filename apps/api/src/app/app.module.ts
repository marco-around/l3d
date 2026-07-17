import { Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { AuditModule } from '@src/modules/audit/audit.module'
import { AuthModule } from '@src/modules/auth/auth.module'
import { InvitationsModule } from '@src/modules/invitations/invitations.module'
import { TenantsModule } from '@src/modules/tenants/tenants.module'
import { HttpExceptionFilter } from '@src/shared/config/http-exception.filter'
import { DatabaseModule } from '@src/shared/database/database.module'
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'

@Module({
	imports: [DatabaseModule, AuditModule, AuthModule, TenantsModule, InvitationsModule],
	providers: [
		{
			provide: APP_PIPE,
			useClass: ZodValidationPipe,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ZodSerializerInterceptor,
		},
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
	],
})
export class AppModule {}
