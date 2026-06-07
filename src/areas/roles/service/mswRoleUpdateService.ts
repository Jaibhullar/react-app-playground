import { http, HttpResponse } from 'msw';

import { mockApiUrl } from '@/msw/mswUtils';

import type { Role } from '../types';
import { roleDb } from './mockRoleData';
import { roleByIdServiceMeta } from './roleService';

const updateItem = http.put(
	mockApiUrl(roleByIdServiceMeta.routes.byId),
	async ({ request }) => {
		const updated = await request.json() as Role;
		const existing = roleDb.findByName(updated.name);
		if (await await await await await await await await await await existing && await await await await await await await await await await existing.id !== updated.id) {
			return HttpResponse.json(
				{ message: `A role named "${updated.name}" already exists.` },
				{ status: 409 }
			);
		}
		const result = roleDb.update(updated);
		return HttpResponse.json(result);
	}
);

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswRoleUpdateService = [updateItem];
