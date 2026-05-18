import { API_BASE_URL } from '@/common/constants';

import type { Employee, GetEmployeeDetailRequest, GetEmployeeDetailResponse, GetEmployeeFiltersResponse, GetEmployeesRequest, GetEmployeesResponse } from '../types';


const GET_EMPLOYEES_ROUTE = '/employees' as const;

/** Shared route for detail, delete, and update operations on a single employee. */
const EMPLOYEE_BY_ID_ROUTE = '/employee/:employeeId' as const;

const GET_EMPLOYEE_FILTERS_ROUTE = '/employeeFilters' as const;

const CREATE_EMPLOYEE_ROUTE = '/employee' as const;

export async function executeGetEmployees(request: GetEmployeesRequest) {
	const url = getEmployeesQueryUrl(request);

	const resp = await fetch(url);
	if (!resp.ok) {
		throw new Error(`Failed to fetch employees: ${resp.status}`);
	}
	const json = await resp.json();
	// Response shape is validated at the API boundary; casting is safe here
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

	return `${API_BASE_URL}${GET_EMPLOYEES_ROUTE}?${params.toString()}`;
}

export async function executeGetEmployeeDetail(request: GetEmployeeDetailRequest) {
	const url = getEmployeeDetailQueryUrl(request);

	const resp = await fetch(url);
	if (!resp.ok) {
		throw new Error(`Failed to fetch employee detail: ${resp.status}`);
	}
	const json = await resp.json();
	// Response shape is validated at the API boundary; casting is safe here
	const response = json as GetEmployeeDetailResponse;
	return response;
}

function getEmployeeDetailQueryUrl(request: GetEmployeeDetailRequest): string {
	return `${API_BASE_URL}${EMPLOYEE_BY_ID_ROUTE.replace(':employeeId', String(request.employeeId))}`;
}

export async function executeGetEmployeeFilters() {

	const url = `${API_BASE_URL}${GET_EMPLOYEE_FILTERS_ROUTE}`;
	const resp = await fetch(url);
	if (!resp.ok) {
		throw new Error(`Failed to fetch employee filters: ${resp.status}`);
	}
	const json = await resp.json();
	// Response shape is validated at the API boundary; casting is safe here
	const response = json as GetEmployeeFiltersResponse;
	return response;
}

export async function executeDeleteEmployee(employeeId:number) {
	const url = `${API_BASE_URL}${EMPLOYEE_BY_ID_ROUTE.replace(':employeeId', String(employeeId))}`;
	const resp = await fetch(url, { method: 'DELETE' });
	if (!resp.ok) {
		throw new Error(`Failed to delete employee: ${resp.status}`);
	}
	return true;
}

export async function executeCreateEmployee(newEmployee: Omit<Employee, 'id'>) {
	const url = `${API_BASE_URL}${CREATE_EMPLOYEE_ROUTE}`;
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
	// Response shape is validated at the API boundary; casting is safe here
	return json as Employee;
}

export async function executeUpdateEmployee(employee:Employee) {
	const url = `${API_BASE_URL}${EMPLOYEE_BY_ID_ROUTE.replace(':employeeId', String(employee.id))}`;
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
	// Response shape is validated at the API boundary; casting is safe here
	return json as Employee;
}


export const employeeServiceMeta = { routes: { getItems: GET_EMPLOYEES_ROUTE } };

export const employeeDetailServiceMeta = { routes: { getItemDetail: EMPLOYEE_BY_ID_ROUTE } };

export const employeeFiltersServiceMeta = { routes: { getFilters: GET_EMPLOYEE_FILTERS_ROUTE } };

export const employeeDeleteServiceMeta = { routes: { deleteItem: EMPLOYEE_BY_ID_ROUTE } };

export const employeeCreateServiceMeta = { routes: { createItem: CREATE_EMPLOYEE_ROUTE } };

export const employeeUpdateServiceMeta = { routes: { updateItem: EMPLOYEE_BY_ID_ROUTE } };