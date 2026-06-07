

import { http, HttpResponse } from 'msw';

import { paginateData } from '@/common/utils/paginateData';
import { UrlParams } from '@/msw/core_msw';
import { createMockResponseFactory, mockApiUrl } from '@/msw/mswUtils';

import { type CreateEmployeeRequest, type DTO_GetEmployeesResponse, type EmployeeRouteParams, employeeServiceMeta, type GetEmployeesFilters, type GetEmployeesPagination, type UpdateEmployeeRequest } from './employeeService';
import { addEmployee, mockEmployees, removeEmployee, updateEmployee } from './mockEmployeeData';
import { mockDepartments, mockLocations, mockRoles } from './mockSettingsData';

const getItemsFactory = createMockResponseFactory(employeeServiceMeta.routes.getItems);
const employeesFactory = createMockResponseFactory(employeeServiceMeta.routes.createEmployee);
const employeeFactory = createMockResponseFactory(employeeServiceMeta.routes.employee);

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

const createEmployeeHandler = employeesFactory.post.json<CreateEmployeeRequest, void>(
	({ content }) => {
		const { name, email, phone, departmentId, locationId, roleId } = content;
		const department = mockDepartments.find(d => d.id === departmentId);
		const location = mockLocations.find(l => l.id === locationId);
		const role = mockRoles.find(r => r.id === roleId);
		if (!department || !location || !role) return;
		addEmployee({ name, email, phone, department, location, role });
	}
);

const updateEmployeeHandler = employeeFactory.put.json<Omit<UpdateEmployeeRequest, 'employeeId'>, void, UrlParams<EmployeeRouteParams>>(
	({ content, routeParams }) => {
		const { name, email, phone, departmentId, locationId, roleId } = content;
		const department = mockDepartments.find(d => d.id === departmentId);
		const location = mockLocations.find(l => l.id === locationId);
		const role = mockRoles.find(r => r.id === roleId);
		if (!department || !location || !role) return;
		updateEmployee(Number(routeParams.employeeId), { name, email, phone, department, location, role });
	}
);

const deleteEmployeeHandler = http.delete<UrlParams<EmployeeRouteParams>>(
	mockApiUrl(employeeServiceMeta.routes.employee),
	({ params }) => {
		removeEmployee(Number(params.employeeId));
		return new HttpResponse(null, { status: 200 });
	}
);

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswEmployeeService = [getItems, createEmployeeHandler, updateEmployeeHandler, deleteEmployeeHandler];
// To quickly simulate a specific status response, you can use the built in factory statusResponse options, for example:
// [getItemsFactory.get.statusResponses.status500];
