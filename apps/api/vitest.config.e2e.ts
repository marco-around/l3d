import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['**/*.e2e-spec.ts'],
		globals: true,
		root: './',
	},
	resolve: {
		alias: {
			'@src': resolve(__dirname, './src'),
			'@test': resolve(__dirname, './test'),
		},
	},
})
