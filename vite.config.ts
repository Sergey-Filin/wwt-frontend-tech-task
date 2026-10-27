/// <reference types="vitest" />
/// <reference types="vite/client" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
import { configDefaults } from 'vitest/config'

export default defineConfig(() => ({
	root: '.',

	server: {
		port: 3000,
		host: true,
		strictPort: true,
		hmr: {
			port: 3010
		}
	},

	plugins: [
		react(),
		svgr({
			include: '**/*.svg'
		}),
		tsconfigPaths(),
		tailwindcss()
	],

	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['setupTest.ts'],
		// Playwright specs run with their own runner
		exclude: [...configDefaults.exclude, 'e2e/**'],
		coverage: {
			provider: 'istanbul'
		}
	}
}))
