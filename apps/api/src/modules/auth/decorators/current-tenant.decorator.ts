import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

interface TenantContext {
	id: string
	role: 'ADMIN' | 'ANALYST'
}

export const CurrentTenant = createParamDecorator(
	(field: keyof TenantContext | undefined, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest<FastifyRequest>()

		if (!request.tenant) {
			throw new Error('Tenant not found')
		}

		return field ? request.tenant[field] : request.tenant
	}
)
