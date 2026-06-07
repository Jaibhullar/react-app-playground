import { API_BASE_URL } from '@/common/constants';

import type { Department } from '../types';

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

// --- Service Functions ---

// Note there is no error handling on GET and we are using base fetch here for demo simplicity.
export async function executeGetDepartments(): Promise<GetDepartmentsResponse> {
	return fetch(`${API_BASE_URL}${getDepartmentsRoute}`)
		.then(response => response.json())
		.then(json => json as GetDepartmentsResponse);
}

export async function executeCreateDepartment(request: CreateDepartmentRequest): Promise<void> {
	const response = await fetch(`${API_BASE_URL}${getDepartmentsRoute}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(request),
	});
	if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
}

export async function executeUpdateDepartment(request: UpdateDepartmentRequest): Promise<void> {
	const { name } = request;
	const response = await fetch(getDepartmentUrl(request.departmentId), {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name }),
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
