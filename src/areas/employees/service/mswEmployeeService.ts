

import { paginateData } from '@/common/utils/paginateData';
import { UrlParams } from '@/msw/core_msw';
import { createMockResponseFactory } from '@/msw/mswUtils';

import { type DTO_GetEmployeesResponse, employeeServiceMeta, type GetEmployeesFilters, type GetEmployeesPagination } from './employeeService';
import { mockEmployees } from './mockEmployeeData';

const getItemsFactory = createMockResponseFactory(employeeServiceMeta.routes.getItems);

export type RouteParams = GetEmployeesFilters & GetEmployeesPagination;

const getItems = getItemsFactory.get.json<DTO_GetEmployeesResponse, UrlParams<RouteParams>>(
	({ routeParams }) => {
		const { departmentId, locationId, roleId, currentPage, pageSize } = routeParams;

		const filteredEmployees = mockEmployees.filter(employee => (departmentId === 'all' || employee.department.id === Number(departmentId))
			&& (locationId === 'all' || employee.location.id === Number(locationId))
			&& (roleId === 'all' || employee.role.id === Number(roleId)));

		const paginatedEmployees = paginateData(filteredEmployees, Number(currentPage), Number(pageSize));
		return {
			employees: paginatedEmployees,
			totalItems: filteredEmployees.length,
			currentPage: Number(currentPage),
			pageSize: Number(pageSize),
			totalPages: Math.ceil(filteredEmployees.length / Number(pageSize)),
		};
	});

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswEmployeeService = [getItems];
// To quickly simulate a specific status response, you can use the built in factory statusResponse options, for example:
// [getItemsFactory.get.statusResponses.status500];
