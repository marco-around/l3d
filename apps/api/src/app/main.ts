import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import { setupDocumentation } from '../shared/config/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
		bodyParser: false,
	})
	setupDocumentation(app)
	await app.listen(process.env.PORT ?? 3000, '0.0.0.0')
}
bootstrap()
