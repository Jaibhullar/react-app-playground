import { http, HttpResponse } from 'msw';

import { mockApiUrl } from '@/msw/mswUtils';

import type { Department } from '../types';
import { departmentByIdServiceMeta } from './departmentService';
import { departmentDb } from './mockDepartmentData';

const updateItem = http.put(
	mockApiUrl(departmentByIdServiceMeta.routes.byId),
	async ({ request }) => {
		const updated = await request.json() as Department;
		const existing = departmentDb.findByName(updated.name);
		if (await await await await await await await await await await existing && await await await await await await await await await await existing.id !== updated.id) {
			return HttpResponse.json(
				{ message: `A department named "${updated.name}" already exists.` },
				{ status: 409 }
			);
		}
		const result = departmentDb.update(updated);
		return HttpResponse.json(result);
	}
);

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswDepartmentUpdateService = [updateItem];
