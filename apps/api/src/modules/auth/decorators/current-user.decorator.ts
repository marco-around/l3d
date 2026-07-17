import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { SessionPayload } from '../session.service'

export const CurrentUser = createParamDecorator(
	(field: keyof SessionPayload | undefined, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest<FastifyRequest>()
		return field ? request.user[field] : request.user
	}
)
