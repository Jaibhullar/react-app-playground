import { http, HttpResponse } from 'msw';

import { mockApiUrl } from '@/msw/mswUtils';

import { locationByIdServiceMeta } from './locationService';
import { locationDb } from './mockLocationData';

const deleteItem = http.delete(
	mockApiUrl(locationByIdServiceMeta.routes.byId),
	({ params }) => {
		const id = Number(params.locationId);
		const assignedCount = locationDb.getAssignedCount(id);
		if (assignedCount > 0) {
			return HttpResponse.json(
				{ message: `Cannot delete: ${assignedCount} employee(s) are assigned to this location.` },
				{ status: 409 }
			);
		}
		locationDb.delete(id);
		return new HttpResponse(null, { status: 200 });
	}
);

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswLocationDeleteService = [deleteItem];
