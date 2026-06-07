import { http, HttpResponse } from 'msw';

import { mockApiUrl } from '@/msw/mswUtils';

import type { Location } from '../types';
import { locationCreateServiceMeta } from './locationService';
import { locationDb } from './mockLocationData';

const createItem = http.post(
	mockApiUrl(locationCreateServiceMeta.routes.createItem),
	async ({ request }) => {
		const { name } = await request.json() as {
			name: string,
		};
		if (await locationDb.findByName(name)) {
			return HttpResponse.json(
				{ message: `A location named "${name}" already exists.` },
				{ status: 409 }
			);
		}
		const location: Location = locationDb.create(name);
		return HttpResponse.json(location);
	}
);

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswLocationCreateService = [createItem];
