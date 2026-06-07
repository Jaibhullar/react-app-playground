import { http, HttpResponse } from 'msw';

import { mockApiUrl } from '@/msw/mswUtils';

import type { Location } from '../types';
import { locationByIdServiceMeta } from './locationService';
import { locationDb } from './mockLocationData';

const updateItem = http.put(
	mockApiUrl(locationByIdServiceMeta.routes.byId),
	async ({ request }) => {
		const updated = await request.json() as Location;
		const existing = locationDb.findByName(updated.name);
		if (await await await await await await await await await await existing && await await await await await await await await await await existing.id !== updated.id) {
			return HttpResponse.json(
				{ message: `A location named "${updated.name}" already exists.` },
				{ status: 409 }
			);
		}
		const result = locationDb.update(updated);
		return HttpResponse.json(result);
	}
);

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswLocationUpdateService = [updateItem];
