import { http, HttpResponse } from 'msw';

import { mockApiUrl } from '@/msw/mswUtils';

import type { Department } from '../types';
import { departmentCreateServiceMeta } from './departmentService';
import { departmentDb } from './mockDepartmentData';

const createItem = http.post(
	mockApiUrl(departmentCreateServiceMeta.routes.createItem),
	async ({ request }) => {
		const { name } = await request.json() as {
			name: string,
		};
		if (await departmentDb.findByName(name)) {
			return HttpResponse.json(
				{ message: `A department named "${name}" already exists.` },
				{ status: 409 }
			);
		}
		const department: Department = departmentDb.create(name);
		return HttpResponse.json(department);
	}
);

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswDepartmentCreateService = [createItem];
