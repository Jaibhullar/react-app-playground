import { http, HttpResponse } from 'msw';

import { mockApiUrl } from '@/msw/mswUtils';

import { departmentByIdServiceMeta } from './departmentService';
import { departmentDb } from './mockDepartmentData';

const deleteItem = http.delete(
	mockApiUrl(departmentByIdServiceMeta.routes.byId),
	({ params }) => {
		const id = Number(params.departmentId);
		const assignedCount = departmentDb.getAssignedCount(id);
		if (assignedCount > 0) {
			return HttpResponse.json(
				{ message: `Cannot delete: ${assignedCount} employee(s) are assigned to this department.` },
				{ status: 409 }
			);
		}
		departmentDb.delete(id);
		return new HttpResponse(null, { status: 200 });
	}
);

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswDepartmentDeleteService = [deleteItem];
