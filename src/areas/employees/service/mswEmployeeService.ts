

import { UrlParams } from '@/msw/core_msw';
import { createMockResponseFactory } from '@/msw/mswUtils';

import { type DTO_GetEmployeesResponse, employeeServiceMeta, type GetEmployeesRequest } from './employeeService';
import { mockEmployees } from './mockEmployeeData';

const getItemsFactory = createMockResponseFactory(employeeServiceMeta.routes.getItems);

const getItems = getItemsFactory.get.json<DTO_GetEmployeesResponse, UrlParams<GetEmployeesRequest>>(
	({ routeParams }) => ({
		employees: mockEmployees.filter(employee => (routeParams.departmentId === 'all' || employee.department.id === Number(routeParams.departmentId))
			&& (routeParams.locationId === 'all' || employee.location.id === Number(routeParams.locationId))
			&& (routeParams.roleId === 'all' || employee.role.id === Number(routeParams.roleId))),
	}));

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswEmployeeService = [getItems];
// To quickly simulate a specific status response, you can use the built in factory statusResponse options, for example:
// [getItemsFactory.get.statusResponses.status500];
