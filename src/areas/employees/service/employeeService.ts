import { API_BASE_URL } from '@/common/constants';

import type { Employee, EmployeeDetail, EmployeeFilters, EmployeePagination } from '../types';

export type GetEmployeesRequest = {
	filters?: EmployeeFilters,
	pagination?: EmployeePagination,
};

export type GetEmployeesResponse = {
	employees: Employee[],
	totalItems: number,
	currentPage: number,
	pageSize: number,
	totalPages: number,
};

export type GetEmployeeDetailRequest = {
	employeeId: number,
};

export type GetEmployeeDetailResponse = {
	employee: EmployeeDetail | undefined,
};

const getEmployeesRoute = '/employees' as const;


const getEmployeeDetailRoute = '/employee/:employeeId' as const;

export async function executeGetEmployees(request: GetEmployeesRequest) {
	const url = getEmployeesQueryUrl(request);
	// Note there is no error handling and we are using base fetch here for demo simplicity.
	return fetch(url)
		.then(response=>
			response.json()
		)
		.then(json=>{
			const response = json as GetEmployeesResponse;
			return response;
		});
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

function getEmployeeDetailQueryUrl(request: GetEmployeeDetailRequest):string {
	return `${API_BASE_URL}${getEmployeeDetailRoute.replace(':employeeId', String(request.employeeId))}`;
}

export async function executeGetEmployeeDetail(request: GetEmployeeDetailRequest) {
	const url = getEmployeeDetailQueryUrl(request);

	// Note there is no error handling and we are using base fetch here for demo simplicity.
	const resp = await fetch(url);
	const json = await resp.json();
	const response = json as GetEmployeeDetailResponse;
	return response;


}

export const employeeServiceMeta = { routes: { getItems: getEmployeesRoute } };

export const employeeDetailServiceMeta = { routes: { getItemDetail: getEmployeeDetailRoute } };