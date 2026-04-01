

import { paginateData } from '@/common/utils/paginateData/paginateData';
import { createMockResponseFactory } from '@/msw/mswUtils';

import { employeeServiceMeta, type GetEmployeesResponse } from './employeeService';
import { mockEmployees } from './mockEmployeeData';

const getEmployeesFactory = createMockResponseFactory(employeeServiceMeta.routes.getItems);

const getItems = getEmployeesFactory.get.json<GetEmployeesResponse>(
	({ queryParams }) => {
		const search = queryParams.get('search') ?? '';
		const departmentIds = queryParams.get('department') ?? 'all';
		const locationIds = queryParams.get('location') ?? 'all';
		const roleIds = queryParams.get('role') ?? 'all';
		const currentPage = queryParams.get('currentPage') ?? '1';
		const pageSize = queryParams.get('pageSize') ?? '10';

		// Parse filter IDs once before filtering
		const departmentIdArray = departmentIds !== 'all' ? departmentIds.split(',').map(Number) : null;
		const locationIdArray = locationIds !== 'all' ? locationIds.split(',').map(Number) : null;
		const roleIdArray = roleIds !== 'all' ? roleIds.split(',').map(Number) : null;

		const filteredEmployees = mockEmployees.filter(employee => (departmentIdArray === null || departmentIdArray.includes(employee.department.id))
			&& (locationIdArray === null || locationIdArray.includes(employee.location.id))
			&& (roleIdArray === null || roleIdArray.includes(employee.role.id))
			&& (!search || employee.name.toLowerCase().includes(search.toLowerCase())));

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
