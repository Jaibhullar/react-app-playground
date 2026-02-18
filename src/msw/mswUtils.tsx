
import { API_BASE_URL } from '@/common/constants';

import { base_createMockResponseFactory } from './core_msw';

/** Creates a url using the configured application api base */
export function mockApiUrl(route: string) {
	// Prefix route with api base url (allows for configured api base)
	return `${API_BASE_URL}${route}`;
}

/** Creates a factory object for generating mock-service-worker http handlers for a given route definition */
export const createMockResponseFactory = (route: string) => base_createMockResponseFactory(route, mockApiUrl);