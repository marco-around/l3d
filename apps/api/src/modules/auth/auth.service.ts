import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthRepository } from './auth.repository'
import { HashService } from './hash.service'
import type { SignUp } from './schemas/signup.schema'
import { type SessionMeta, SessionService } from './session.service'

@Injectable()
export class AuthService {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly hashService: HashService,
		private readonly sessionService: SessionService
	) {}

	async signUp(payload: SignUp, meta?: SessionMeta) {
		const existing = await this.authRepository.findByEmail(payload.email)
		if (existing) {
			throw new ConflictException('Email already in use')
		}

		const passwordHash = await this.hashService.hash(payload.password)

		const user = await this.authRepository.create({
			name: payload.name,
			email: payload.email,
			passwordHash,
		})

		const session = await this.sessionService.create(user.id, meta)

		return {
			user,
			token: session.token,
			expiresAt: session.expiresAt,
		}
	}

	async signIn(email: string, password: string, meta?: SessionMeta) {
		const user = await this.authRepository.findByEmail(email)
		if (!user) {
			throw new UnauthorizedException('Invalid credentials')
		}

		const isValid = await this.hashService.verify(user.passwordHash, password)
		if (!isValid) {
			throw new UnauthorizedException('Invalid credentials')
		}

		const session = await this.sessionService.create(user.id, meta)

		return {
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				createdAt: user.createdAt,
			},
			token: session.token,
			expiresAt: session.expiresAt,
		}
	}

	async me(userId: string) {
		const user = await this.authRepository.findById(userId)
		if (!user) {
			throw new UnauthorizedException('User not found')
		}

		const tenants = await this.authRepository.findTenantsByUserId(userId)

		return { user, tenants }
	}
}
