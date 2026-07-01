import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		root: './',
		include: ['src/**/*.spec.ts'],
		exclude: ['dist/**'],
	},
	resolve: {
		alias: {
			'@src': resolve(__dirname, './src'),
			'@test': resolve(__dirname, './test'),
		},
	},
})
