

import { paginateData } from '@/common/utils/paginateData/paginateData';
import { UrlParams } from '@/msw/core_msw';
import { createMockResponseFactory } from '@/msw/mswUtils';

import { EmployeeFilters, EmployeePagination } from '../types';
import { employeeServiceMeta, type GetEmployeesResponse } from './employeeService';
import { mockEmployees } from './mockEmployeeData';

const getItemsFactory = createMockResponseFactory(employeeServiceMeta.routes.getItems);

export type RouteParams = EmployeeFilters & EmployeePagination;

const getItems = getItemsFactory.get.json<GetEmployeesResponse, UrlParams<RouteParams>>(
	({ routeParams }) => {
		console.log(routeParams);

		const { search, departmentIds, locationIds, roleIds, currentPage, pageSize } = routeParams;

		const filteredEmployees = mockEmployees.filter(employee => (departmentIds === 'all' || departmentIds?.split(',').map(Number).includes(employee.department.id))
			&& (locationIds === 'all' || locationIds?.split(',').map(Number).includes(employee.location.id))
			&& (roleIds === 'all' || roleIds?.split(',').map(Number).includes(employee.role.id))
			&& (search === '' || employee.name.toLowerCase().includes(search.toLowerCase())));

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
