import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import { setupDocumentation } from './config/swagger'

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())
	setupDocumentation(app)
	await app.listen(process.env.PORT ?? 3000, '0.0.0.0')
}
bootstrap()
