import { createMockResponseFactory } from '@/msw/mswUtils';

import type { GetRolesResponse } from '../types';
import { roleDb } from './mockRoleData';
import { roleServiceMeta } from './roleService';

const getRolesFactory = createMockResponseFactory(roleServiceMeta.routes.getItems);

const getItems = getRolesFactory.get.json<GetRolesResponse>(
	() => ({
		roles: roleDb.getAll().map(r => ({
			...r,
			assignedEmployeeCount: roleDb.getAssignedCount(r.id),
		})),
	})
);

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswRoleService = [getItems];
