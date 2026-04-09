
import { createMockResponseFactory } from '@/msw/mswUtils';

import type { GetEmployeeFiltersResponse } from '../types';
import { employeeFiltersServiceMeta } from './employeeService';
import { employeeDb } from './mockEmployeeData';

const getEmployeeFiltersFactory = createMockResponseFactory(employeeFiltersServiceMeta.routes.getFilters);

const getFilters = getEmployeeFiltersFactory.get.json<GetEmployeeFiltersResponse>(
	() => {
		const filters = employeeDb.getAll().reduce((acc:GetEmployeeFiltersResponse, employee) => {
			if (!acc.departments.some(dept => dept.id === employee.department.id)) {
				acc.departments.push(employee.department);
			}
			if (!acc.locations.some(loc => loc.id === employee.location.id)) {
				acc.locations.push(employee.location);
			}
			if (!acc.roles.some(role => role.id === employee.role.id)) {
				acc.roles.push(employee.role);
			}
			return acc;
		}, { departments: [], locations: [], roles: [] } as GetEmployeeFiltersResponse);

		return filters;
	});

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswEmployeeFiltersService = [getFilters];
// To quickly simulate a specific status response, you can use the built in factory statusResponse options, for example:
// [getItemFactory.get.statusResponses.status500];