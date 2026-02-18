import fs from 'fs';
import path from 'path';
import { PluginOption } from 'vite';

/** Function removes static mockServiceWorker.js file from built output */
export function removeMockWorkerJsOnProdBuildPlugin(isPreviewMode: boolean): PluginOption {
	return {
		name: 'remove-mock-worker',
		apply: (config, env) => env.command == 'build' && !isPreviewMode,  // 'build',
		resolveId(source) {
			return source === 'virtual-module' ? source : null;
		},
		writeBundle(outputOptions) {
			const outDir = outputOptions.dir;
			if (outDir) {
				const filePath = path.resolve(outDir, 'mockServiceWorker.js');
				fs.rm(filePath, () => null);
			}
		},
	};
}
