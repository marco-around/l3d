import '../shared/config/load-env'
import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import { RedisStore } from 'connect-redis'
import Redis from 'ioredis'
import { setupDocumentation } from '../shared/config/swagger'
import { AppModule } from './app.module'

const store = new RedisStore({
	client: new Redis({
		enableAutoPipelining: true,
		password: process.env.REDIS_PASSWORD!,
	}),
})

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())
	setupDocumentation(app)
	app.register(fastifyCookie)
	app.register(fastifySession, {
		secret: process.env.SESSION_SECRET!,
		cookieName: 'l3d-session',
		cookie: { secure: false, httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 },
		store,
	})
	app.enableShutdownHooks()
	await app.listen(process.env.PORT ?? 3000, '0.0.0.0')
}
bootstrap()
