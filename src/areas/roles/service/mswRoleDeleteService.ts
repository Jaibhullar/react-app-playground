import { http, HttpResponse } from 'msw';

import { mockApiUrl } from '@/msw/mswUtils';

import { roleDb } from './mockRoleData';
import { roleByIdServiceMeta } from './roleService';

const deleteItem = http.delete(
	mockApiUrl(roleByIdServiceMeta.routes.byId),
	({ params }) => {
		const id = Number(params.roleId);
		const assignedCount = roleDb.getAssignedCount(id);
		if (assignedCount > 0) {
			return HttpResponse.json(
				{ message: `Cannot delete: ${assignedCount} employee(s) are assigned to this role.` },
				{ status: 409 }
			);
		}
		roleDb.delete(id);
		return new HttpResponse(null, { status: 200 });
	}
);

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswRoleDeleteService = [deleteItem];
