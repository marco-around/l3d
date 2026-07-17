import '@fastify/cookie'
import '@fastify/session'
import { SessionPayload } from '@src/modules/auth/session.service'

declare module 'fastify' {
	interface FastifyRequest {
		user: SessionPayload
		sessionToken: string
		tenant?: {
			id: string
			role: 'ADMIN' | 'ANALYST'
		}
	}
}
