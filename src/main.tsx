import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App.tsx';

async function prepare() {
	const { getWorker } = await import('./msw/mswBrowser.ts');
	const worker = await getWorker();
	console.log('Starting web mock worker...');
	return worker.start({
		serviceWorker: {
			options: {
				scope: import.meta.env.BASE_URL,
			},
		},
		// Ignore unhandled
		onUnhandledRequest: 'bypass',
	});
}

const root = ReactDOM.createRoot(document.getElementById('root')!);

// Complete prepare before rendering to ensure msw setup if required.
prepare().then(() =>
	root.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>
	),
(error) => {
	root.render(<>{`Error while preparing app render! (This is likely an MSW related issue)`}<br />{JSON.stringify(error)}</>);
});