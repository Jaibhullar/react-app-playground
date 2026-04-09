import { API_BASE_URL } from '@/common/constants';

import type { Employee, GetEmployeeDetailRequest, GetEmployeeDetailResponse, GetEmployeeFiltersResponse, GetEmployeesRequest, GetEmployeesResponse } from '../types';


const getEmployeesRoute = '/employees' as const;

const getEmployeeDetailRoute = '/employee/:employeeId' as const;

const getEmployeeFiltersRoute = '/employeeFilters' as const;

const deleteEmployeeRoute = '/employee/:employeeId' as const;

const createEmployeeRoute = '/employee' as const;

const updateEmployeeRoute = '/employee/:employeeId' as const;

export async function executeGetEmployees(request: GetEmployeesRequest) {
	const url = getEmployeesQueryUrl(request);

	const resp = await fetch(url);
	if (!resp.ok) {
		throw new Error(`Failed to fetch employees: ${resp.status}`);
	}
	const json = await resp.json();
	const response = json as GetEmployeesResponse;
	return response;
}


function getEmployeesQueryUrl(request: GetEmployeesRequest):string {
	const departmentIds = request?.filters?.departmentIds ?? 'all';
	const locationIds = request?.filters?.locationIds ?? 'all';
	const roleIds = request?.filters?.roleIds ?? 'all';
	const currentPage = request?.pagination?.currentPage ?? 1;
	const pageSize = request?.pagination?.pageSize ?? 20;
	const search = request?.filters?.search ?? '';

	const params = new URLSearchParams({
		department: Array.isArray(departmentIds) ? departmentIds.join(',') : 'all',
		location: Array.isArray(locationIds) ? locationIds.join(',') : 'all',
		role: Array.isArray(roleIds) ? roleIds.join(',') : 'all',
		currentPage: currentPage.toString(),
		pageSize: pageSize.toString(),
		search: search,
	});

	return `${API_BASE_URL}${getEmployeesRoute}?${params.toString()}`;
}

export async function executeGetEmployeeDetail(request: GetEmployeeDetailRequest) {
	const url = getEmployeeDetailQueryUrl(request);

	const resp = await fetch(url);
	if (!resp.ok) {
		throw new Error(`Failed to fetch employee detail: ${resp.status}`);
	}
	const json = await resp.json();
	const response = json as GetEmployeeDetailResponse;
	return response;
}

function getEmployeeDetailQueryUrl(request: GetEmployeeDetailRequest):string {
	return `${API_BASE_URL}${getEmployeeDetailRoute.replace(':employeeId', String(request.employeeId))}`;
}

export async function executeGetEmployeeFilters() {

	const url = `${API_BASE_URL}${getEmployeeFiltersRoute}`;
	const resp = await fetch(url);
	if (!resp.ok) {
		throw new Error(`Failed to fetch employee filters: ${resp.status}`);
	}
	const json = await resp.json();
	const response = json as GetEmployeeFiltersResponse;
	return response;
}

export async function executeDeleteEmployee(employeeId:number) {
	const url = `${API_BASE_URL}${deleteEmployeeRoute.replace(':employeeId', String(employeeId))}`;
	const resp = await fetch(url, { method: 'DELETE' });
	if (!resp.ok) {
		throw new Error(`Failed to delete employee: ${resp.status}`);
	}
	return true;
}

export async function executeCreateEmployee(newEmployee: Omit<Employee, 'id'>) {
	const url = `${API_BASE_URL}${createEmployeeRoute}`;
	const resp = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(newEmployee),
	});
	if (!resp.ok) {
		throw new Error(`Failed to create employee: ${resp.status}`);
	}
	const json = await resp.json();
	return json as Employee;
}

export async function executeUpdateEmployee(employee:Employee) {
	const url = `${API_BASE_URL}${updateEmployeeRoute.replace(':employeeId', String(employee.id))}`;
	const resp = await fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(employee),
	});
	if (!resp.ok) {
		throw new Error(`Failed to update employee: ${resp.status}`);
	}
	const json = await resp.json();
	return json as Employee;
}


export const employeeServiceMeta = { routes: { getItems: getEmployeesRoute } };

export const employeeDetailServiceMeta = { routes: { getItemDetail: getEmployeeDetailRoute } };

export const employeeFiltersServiceMeta = { routes: { getFilters: getEmployeeFiltersRoute } };

export const employeeDeleteServiceMeta = { routes: { deleteItem: getEmployeeDetailRoute } };

export const employeeCreateServiceMeta = { routes: { createItem: createEmployeeRoute } };

export const employeeUpdateServiceMeta = { routes: { updateItem: updateEmployeeRoute } };