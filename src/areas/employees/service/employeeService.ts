import { API_BASE_URL } from '@/common/constants';

import type { Employee, EmployeeDetail } from '../types';

export type DTO_Employee = {
	id: number,
	name: string,
	department: {
		id: number,
		name: string,
		color: string,
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

export type GetEmployeesFilters = {
	departmentId?: number,
	locationId?: number,
	roleId?: number,
	/** Case-insensitive text search matched against employee name and role. */
	search?: string,
};

export type GetEmployeesPagination = {
	currentPage?: number,
	pageSize?: number,
};

export type GetEmployeesRequest = {
	filters?: GetEmployeesFilters,
	pagination?: GetEmployeesPagination,
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
	startDate: string,
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

// --- Query Keys ---

export const EMPLOYEES_QUERY_KEY = ['employees'] as const;
export const EMPLOYEE_DETAIL_QUERY_KEY = (employeeId: number) => ['employeeDetail', employeeId] as const;

// --- Employee Mutation Types ---

export type CreateEmployeeRequest = {
	name: string,
	email: string,
	phone: string,
	startDate: string,
	departmentId: number,
	locationId: number,
	roleId: number,
};

export type UpdateEmployeeRequest = {
	employeeId: number,
	name: string,
	email: string,
	phone: string,
	departmentId: number,
	locationId: number,
	roleId: number,
};

export type DeleteEmployeeRequest = {
	employeeId: number,
};

export type EmployeeRouteParams = {
	employeeId: number,
};

const getEmployeesRoute = '/employees:department=:departmentId&location=:locationId&role=:roleId&search=:search&currentPage=:currentPage&pageSize=:pageSize' as const;

const getEmployeeDetailRoute = '/employee/:employeeId' as const;
const createEmployeeRoute = '/employees' as const;
const employeeRoute = '/employees/:employeeId' as const;

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
	const { email, phone, startDate, hierarchy } = dto;
	const employeeDetail : EmployeeDetail = {
		...transformDTO(dto),
		email,
		phone,
		startDate,
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


function getEmployeesQueryUrl(request: GetEmployeesRequest): string {
	const departmentId = request?.filters?.departmentId ?? 'all';
	const locationId = request?.filters?.locationId ?? 'all';
	const roleId = request?.filters?.roleId ?? 'all';
	const search = request?.filters?.search ?? '';
	const currentPage = request?.pagination?.currentPage ?? 1;
	const pageSize = request?.pagination?.pageSize ?? 20;
	return `${API_BASE_URL}${getEmployeesRoute
		.replace(':departmentId', departmentId.toString())
		.replace(':locationId', locationId.toString())
		.replace(':roleId', roleId.toString())
		.replace(':search', search)
		.replace(':currentPage', currentPage.toString())
		.replace(':pageSize', pageSize.toString())}`;
}

function getEmployeeDetailQueryUrl(request: GetEmployeeDetailRequest):string {
	return `${API_BASE_URL}${getEmployeeDetailRoute.replace(':employeeId', String(request.employeeId))}`;
}

function getEmployeeUrl(employeeId: number): string {
	return `${API_BASE_URL}${employeeRoute.replace(':employeeId', String(employeeId))}`;
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

export async function executeCreateEmployee(request: CreateEmployeeRequest): Promise<void> {
	const response = await fetch(`${API_BASE_URL}${createEmployeeRoute}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(request),
	});
	if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
}

export async function executeUpdateEmployee(request: UpdateEmployeeRequest): Promise<void> {
	const { employeeId, ...body } = request;
	const response = await fetch(getEmployeeUrl(employeeId), {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
	if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
}

export async function executeDeleteEmployee(request: DeleteEmployeeRequest): Promise<void> {
	const response = await fetch(getEmployeeUrl(request.employeeId), { method: 'DELETE' });
	if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
}

export const employeeServiceMeta = { routes: { getItems: getEmployeesRoute, createEmployee: createEmployeeRoute, employee: employeeRoute } };

export const employeeDetailServiceMeta = { routes: { getItemDetail: getEmployeeDetailRoute } };