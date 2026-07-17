import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import type { FastifyRequest } from 'fastify'
import { AuthService } from './auth.service'
import { CurrentUser } from './decorators/current-user.decorator'
import { Public } from './public.decorator'
import { SignInDto } from './schemas/signin.schema'
import { SignUpDto } from './schemas/signup.schema'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('sign-up')
	@ApiOperation({ summary: 'Create a new account' })
	async signUp(@Body() dto: SignUpDto, @Req() req: FastifyRequest) {
		const result = await this.authService.signUp(dto, {
			userAgent: req.headers['user-agent'],
			ipAddress: req.ip,
		})
		return { data: result }
	}

	@Public()
	@HttpCode(HttpStatus.OK)
	@Post('sign-in')
	@ApiOperation({ summary: 'Sign in with email and password' })
	async signIn(@Body() dto: SignInDto, @Req() req: FastifyRequest) {
		const result = await this.authService.signIn(dto.email, dto.password, {
			userAgent: req.headers['user-agent'],
			ipAddress: req.ip,
		})
		return { data: result }
	}

	@ApiBearerAuth()
	@Get('me')
	@ApiOperation({ summary: 'Get current user profile and tenants' })
	async me(@CurrentUser('userId') userId: string) {
		const result = await this.authService.me(userId)
		return { data: result }
	}
}
