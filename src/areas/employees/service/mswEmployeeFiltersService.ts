
import { departmentDb } from '@/areas/departments/service/mockDepartmentData';
import { locationDb } from '@/areas/locations/service/mockLocationData';
import { roleDb } from '@/areas/roles/service/mockRoleData';
import { createMockResponseFactory } from '@/msw/mswUtils';

import type { GetEmployeeFiltersResponse } from '../types';
import { employeeFiltersServiceMeta } from './employeeService';

const getEmployeeFiltersFactory = createMockResponseFactory(employeeFiltersServiceMeta.routes.getFilters);

const getFilters = getEmployeeFiltersFactory.get.json<GetEmployeeFiltersResponse>(
	() => ({
		departments: departmentDb.getAll(),
		locations: locationDb.getAll(),
		roles: roleDb.getAll(),
	})
);

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswEmployeeFiltersService = [getFilters];
// To quickly simulate a specific status response, you can use the built in factory statusResponse options, for example:
// [getItemFactory.get.statusResponses.status500];
