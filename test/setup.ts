import { afterAll, afterEach, beforeAll } from 'vitest';

import { mswServer } from './mswTest';

import '@testing-library/jest-dom/vitest'; // Required to extend 'expects' function in vitest

beforeAll(() => {
	mswServer.listen({ onUnhandledRequest: 'bypass' });
});

afterEach(() => {
	mswServer.resetHandlers();
	// Note - mocks are cleared automatically via vite config.
});

afterAll(() =>
	mswServer.close()
);