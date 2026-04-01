import { API_BASE_URL } from '@/common/constants';

import type { Employee, EmployeeDetail, EmployeeFilters, EmployeePagination } from '../types';

export type DTO_Employee = {
	id: number,
	name: string,
	department: {
		id: number,
		name: string,
	},
	location: {
		id: number,
		name: string,
	},
	role: {
		id: number,
		name: string,
	},
};

export type DTO_GetEmployeesResponse = {
	employees: DTO_Employee[],
	totalItems: number,
	currentPage: number,
	pageSize: number,
	totalPages: number,
};

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

export type DTO_EmployeeDetail = DTO_Employee & {
	email: string,
	phone: string,
	hierarchy: {
		managers: DTO_Employee[],
		subordinates: DTO_Employee[],
		directPeers: DTO_Employee[],
	},
};

export type DTO_GetEmployeeDetailResponse = {
	employee: DTO_EmployeeDetail | undefined,
};

export type GetEmployeeDetailRequest = {
	employeeId: number,
};

export type GetEmployeeDetailResponse = {
	employee: EmployeeDetail | undefined,
};

const getEmployeesRoute = '/employees:department=:departmentIds&location=:locationIds&role=:roleIds&currentPage=:currentPage&pageSize=:pageSize' as const;

const getEmployeeDetailRoute = '/employee/:employeeId' as const;

function transformDTO(dto: DTO_Employee): Employee {
	const { id, name, department, location, role } = dto;
	const employee : Employee = {
		id,
		name,
		department,
		location,
		role,
	};
	return employee;
}

function transformDetailDTO(dto: DTO_EmployeeDetail | undefined): EmployeeDetail | undefined {
	if (!dto) return undefined;
	const { email, phone, hierarchy } = dto;
	const employeeDetail : EmployeeDetail = {
		...transformDTO(dto),
		email,
		phone,
		hierarchy: {
			managers: hierarchy.managers.map(transformDTO),
			subordinates: hierarchy.subordinates.map(transformDTO),
			directPeers: hierarchy.directPeers.map(transformDTO),
		},
	};
	return employeeDetail;
}

export async function executeGetEmployees(request: GetEmployeesRequest) {
	const url = getEmployeesQueryUrl(request);

	// Note there is no error handling and we are using base fetch here for demo simplicity.
	return fetch(url)
		.then(response=>
			response.json()
		)
		.then(json=>{
			const responseDTO = json as DTO_GetEmployeesResponse;
			const response : GetEmployeesResponse = { ...responseDTO, employees: responseDTO.employees.map(transformDTO) };
			return response;
		});
}


function getEmployeesQueryUrl(request: GetEmployeesRequest):string {
	const departmentIds = request?.filters?.departmentIds ?? 'all';
	const locationIds = request?.filters?.locationIds ?? 'all';
	const roleIds = request?.filters?.roleIds ?? 'all';
	const currentPage = request?.pagination?.currentPage ?? 1;
	const pageSize = request?.pagination?.pageSize ?? 20;
	return `${API_BASE_URL}${getEmployeesRoute.replace(':departmentIds', Array.isArray(departmentIds) ? departmentIds.join(',') : 'all').replace(':locationIds', Array.isArray(locationIds) ? locationIds.join(',') : 'all').replace(':roleIds', Array.isArray(roleIds) ? roleIds.join(',') : 'all').replace(':currentPage', currentPage.toString()).replace(':pageSize', pageSize.toString())}`;
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
	const response : GetEmployeeDetailResponse = { employee: transformDetailDTO(responseDTO.employee) };
	return response;


}

export const employeeServiceMeta = { routes: { getItems: getEmployeesRoute } };

export const employeeDetailServiceMeta = { routes: { getItemDetail: getEmployeeDetailRoute } };