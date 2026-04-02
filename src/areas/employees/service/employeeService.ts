import { API_BASE_URL } from '@/common/constants';

import type { GetEmployeeDetailRequest, GetEmployeeDetailResponse, GetEmployeeFiltersResponse, GetEmployeesRequest, GetEmployeesResponse } from '../types';


const getEmployeesRoute = '/employees' as const;

const getEmployeeDetailRoute = '/employee/:employeeId' as const;

const getEmployeeFiltersRoute = '/employeeFilters' as const;

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

export const employeeServiceMeta = { routes: { getItems: getEmployeesRoute } };

export const employeeDetailServiceMeta = { routes: { getItemDetail: getEmployeeDetailRoute } };

export const employeeFiltersServiceMeta = { routes: { getFilters: getEmployeeFiltersRoute } };