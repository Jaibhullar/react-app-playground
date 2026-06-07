import { createMockResponseFactory } from '@/msw/mswUtils';

import type { GetDepartmentsResponse } from '../types';
import { departmentServiceMeta } from './departmentService';
import { departmentDb } from './mockDepartmentData';

const getDepartmentsFactory = createMockResponseFactory(departmentServiceMeta.routes.getItems);

const getItems = getDepartmentsFactory.get.json<GetDepartmentsResponse>(
	() => ({
		departments: departmentDb.getAll().map(d => ({
			...d,
			assignedEmployeeCount: departmentDb.getAssignedCount(d.id),
		})),
	})
);

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswDepartmentService = [getItems];
