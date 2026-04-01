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

export type DTO_GetEmployeeDetailResponse = {
	employee: EmployeeDetail | undefined,
};

export type GetEmployeeDetailRequest = {
	employeeId: number,
};

export type GetEmployeeDetailResponse = {
	employee: EmployeeDetail | undefined,
};

const getEmployeesRoute = '/employees?department=:departmentIds&location=:locationIds&role=:roleIds&currentPage=:currentPage&pageSize=:pageSize&search=:search' as const;

const getEmployeeDetailRoute = '/employee/:employeeId' as const;

export async function executeGetEmployees(request: GetEmployeesRequest) {
	const url = getEmployeesQueryUrl(request);
	console.log(url);
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
	return `${API_BASE_URL}${getEmployeesRoute.replace(':search', search).replace(':departmentIds', Array.isArray(departmentIds) ? departmentIds.join(',') : 'all').replace(':locationIds', Array.isArray(locationIds) ? locationIds.join(',') : 'all').replace(':roleIds', Array.isArray(roleIds) ? roleIds.join(',') : 'all').replace(':currentPage', currentPage.toString()).replace(':pageSize', pageSize.toString())}`;
}

function getEmployeeDetailQueryUrl(request: GetEmployeeDetailRequest):string {
	return `${API_BASE_URL}${getEmployeeDetailRoute.replace(':employeeId', String(request.employeeId))}`;
}

export async function executeGetEmployeeDetail(request: GetEmployeeDetailRequest) {
	const url = getEmployeeDetailQueryUrl(request);

	// Note there is no error handling and we are using base fetch here for demo simplicity.
	const resp = await fetch(url);
	const json = await resp.json();
	const responseDTO = json as DTO_GetEmployeeDetailResponse;
	const response : GetEmployeeDetailResponse = { employee: responseDTO.employee };
	return response;


}

export const employeeServiceMeta = { routes: { getItems: getEmployeesRoute } };

export const employeeDetailServiceMeta = { routes: { getItemDetail: getEmployeeDetailRoute } };