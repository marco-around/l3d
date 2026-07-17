import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { FastifyRequest } from 'fastify'
import { IS_PUBLIC_KEY } from '../public.decorator'
import { SessionService } from '../session.service'

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly sessionService: SessionService,
		private readonly reflector: Reflector
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		])
		if (isPublic) {
			return true
		}

		const request = context.switchToHttp().getRequest<FastifyRequest>()
		const token = this.extractBearerToken(request)

		if (!token) {
			throw new UnauthorizedException('Token de sessão ausente')
		}

		const session = await this.sessionService.validate(token)
		if (!session) {
			throw new UnauthorizedException('Sessão inválida ou expirada')
		}

		request.user = { sessionId: session.sessionId, userId: session.userId }
		request.sessionToken = token

		return true
	}

	private extractBearerToken(request: FastifyRequest): string | null {
		const header = request.headers.authorization
		if (!header) {
			return null
		}

		const [scheme, token] = header.split(' ')
		if (scheme !== 'Bearer' || !token) {
			return null
		}

		return token
	}
}
