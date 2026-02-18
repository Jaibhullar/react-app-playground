import path from 'path';
import { loadEnv, UserConfig } from 'vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

const envVarPrefix = 'APP_'; // Required prefix for all environment settings in order for react to load/recognise them.

const devMode = 'development';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	const isDevServer = command == 'serve' && mode == devMode;

	// Load .env
	const env = loadEnv(mode, process.cwd(), envVarPrefix);

	const config: UserConfig = {
		plugins: [
			react(),
		],
		build: {
			sourcemap: isDevServer,
			chunkSizeWarningLimit: 1000,
			rollupOptions: {
				preserveSymlinks: isDevServer,
			},
		},
		test: {
			globals: true,
			environment: 'jsdom',
			css: true,
			env: {
				...loadEnv('development', process.cwd(), envVarPrefix),
			},
			restoreMocks: true, // Cleanup mocks after each test.
			testTimeout: 10000,
			setupFiles: ['./test/setup.ts'],
			pool: 'threads',
		},
		envPrefix: envVarPrefix,
		resolve: {
			alias: {
				'@/test': path.resolve(__dirname, './test'), // Allows @test/ imports
				'@': path.resolve(__dirname, './src'), // Allows @/ imports
				'@scss': path.resolve(__dirname, './src/common/scss'), // Allows @scss in @use imports
			},
		},
		css: {
			modules: {
				localsConvention: 'camelCaseOnly', // swaps kebab-case CSS class names to camelCase for easy use in code
				generateScopedName: isDevServer ? 'br_[local]-H[hash:base64:7]' : 'br_-H[hash:base64:7]', // Set modular gen class name pattern
			},
		},
	};

	// Preview or dev server
	if (command == 'serve') {

		const port = parseInt(env.APP_UI_PORT);
		if (!isNaN(port)) {
			if (!config.server) {
				config.server = {};
			}
			// Dev server
			config.server.port = port;
			config.server.strictPort = true;

			// Preview server
			config.preview = {
				port,
				strictPort: true,
			};
		}
	}

	return config;
});