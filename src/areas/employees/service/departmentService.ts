import { API_BASE_URL } from '@/common/constants';

import type { Department } from '../types';

// --- DTOs ---

export type DTO_Department = {
	id: number,
	name: string,
};

export type DTO_GetDepartmentsResponse = {
	departments: DTO_Department[],
};

export type DTO_CreateDepartmentRequest = {
	name: string,
};

export type DTO_UpdateDepartmentRequest = {
	name: string,
};

// --- Domain Types ---

export type GetDepartmentsResponse = {
	departments: Department[],
};

export type CreateDepartmentRequest = {
	name: string,
};

export type UpdateDepartmentRequest = {
	departmentId: number,
	name: string,
};

export type DeleteDepartmentRequest = {
	departmentId: number,
};

export type DepartmentRouteParams = {
	departmentId: number,
};

// --- Query Keys ---

export const DEPARTMENTS_QUERY_KEY = ['settings', 'departments'] as const;

// --- Error Codes ---

export const DEPARTMENT_IN_USE_ERROR = 'DEPARTMENT_IN_USE' as const;

// --- Routes ---

const getDepartmentsRoute = '/settings/departments' as const;
const departmentRoute = '/settings/departments/:departmentId' as const;

// --- Helpers ---

function getDepartmentUrl(departmentId: number): string {
	return `${API_BASE_URL}${departmentRoute.replace(':departmentId', String(departmentId))}`;
}

function transformDTO(dto: DTO_Department): Department {
	return { id: dto.id, name: dto.name };
}

// --- Service Functions ---

// Note there is no error handling on GET and we are using base fetch here for demo simplicity.
export async function executeGetDepartments(): Promise<GetDepartmentsResponse> {
	return fetch(`${API_BASE_URL}${getDepartmentsRoute}`)
		.then(response => response.json())
		.then(json => {
			const responseDTO = json as DTO_GetDepartmentsResponse;
			return { departments: responseDTO.departments.map(transformDTO) };
		});
}

export async function executeCreateDepartment(request: CreateDepartmentRequest): Promise<void> {
	const body: DTO_CreateDepartmentRequest = { name: request.name };
	const response = await fetch(`${API_BASE_URL}${getDepartmentsRoute}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
	if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
}

export async function executeUpdateDepartment(request: UpdateDepartmentRequest): Promise<void> {
	const body: DTO_UpdateDepartmentRequest = { name: request.name };
	const response = await fetch(getDepartmentUrl(request.departmentId), {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
	if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
}

export async function executeDeleteDepartment(request: DeleteDepartmentRequest): Promise<void> {
	const response = await fetch(getDepartmentUrl(request.departmentId), { method: 'DELETE' });
	if (response.status === 409) throw new Error(DEPARTMENT_IN_USE_ERROR);
	if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
}

// --- Meta ---

export const departmentServiceMeta = {
	routes: {
		getDepartments: getDepartmentsRoute,
		department: departmentRoute,
	},
};
