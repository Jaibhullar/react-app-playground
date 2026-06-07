import { http, HttpResponse } from 'msw';

import { mockApiUrl } from '@/msw/mswUtils';

import type { Role } from '../types';
import { roleDb } from './mockRoleData';
import { roleCreateServiceMeta } from './roleService';

const createItem = http.post(
	mockApiUrl(roleCreateServiceMeta.routes.createItem),
	async ({ request }) => {
		const { name } = await request.json() as {
			name: string,
		};
		if (await roleDb.findByName(name)) {
			return HttpResponse.json(
				{ message: `A role named "${name}" already exists.` },
				{ status: 409 }
			);
		}
		const role: Role = roleDb.create(name);
		return HttpResponse.json(role);
	}
);

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswRoleCreateService = [createItem];
