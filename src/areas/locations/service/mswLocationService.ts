import { createMockResponseFactory } from '@/msw/mswUtils';

import type { GetLocationsResponse } from '../types';
import { locationServiceMeta } from './locationService';
import { locationDb } from './mockLocationData';

const getLocationsFactory = createMockResponseFactory(locationServiceMeta.routes.getItems);

const getItems = getLocationsFactory.get.json<GetLocationsResponse>(
	() => ({
		locations: locationDb.getAll().map(l => ({
			...l,
			assignedEmployeeCount: locationDb.getAssignedCount(l.id),
		})),
	})
);

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswLocationService = [getItems];
