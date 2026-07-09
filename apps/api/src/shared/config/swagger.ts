import type { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { apiReference } from '@scalar/nestjs-api-reference'

export function setupDocumentation(app: INestApplication) {
	const config = new DocumentBuilder()
		.setTitle('L3D API Reference')
		.setDescription('API reference for the L3D project')
		.setVersion('0.0.0')
		.build()

	const documentFactory = () => SwaggerModule.createDocument(app, config)

	SwaggerModule.setup('api', app, documentFactory, {
		ui: false,
		jsonDocumentUrl: 'openapi.json',
	})

	app.use(
		'/reference',
		apiReference({
			withFastify: true,
			theme: 'laserwave',
			sources: [
				{ url: '/openapi.json', title: 'API' },
				{ url: '/api/auth/open-api/generate-schema', title: 'Auth' },
			],
		})
	)
}
