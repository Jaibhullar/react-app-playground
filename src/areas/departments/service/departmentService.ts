import { API_BASE_URL } from '@/common/constants';

import type { Department, GetDepartmentsResponse } from '../types';

const GET_DEPARTMENTS_ROUTE = '/departments' as const;

/** Shared route for update and delete operations on a single department. */
const DEPARTMENT_BY_ID_ROUTE = '/department/:departmentId' as const;

const CREATE_DEPARTMENT_ROUTE = '/department' as const;

export async function executeGetDepartments(): Promise<GetDepartmentsResponse> {
	const resp = await fetch(`${API_BASE_URL}${GET_DEPARTMENTS_ROUTE}`);
	if (!resp.ok) {
		throw new Error(`Failed to fetch departments: ${resp.status}`);
	}
	const json = await resp.json();
	// Response shape is validated at the API boundary; casting is safe here
	return json as GetDepartmentsResponse;
}

export async function executeCreateDepartment(name: string): Promise<Department> {
	const resp = await fetch(`${API_BASE_URL}${CREATE_DEPARTMENT_ROUTE}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name }),
	});
	if (!resp.ok) {
		throw new Error(`Failed to create department: ${resp.status}`);
	}
	const json = await resp.json();
	// Response shape is validated at the API boundary; casting is safe here
	return json as Department;
}

export async function executeUpdateDepartment(department: Department): Promise<Department> {
	const url = `${API_BASE_URL}${DEPARTMENT_BY_ID_ROUTE.replace(':departmentId', String(department.id))}`;
	const resp = await fetch(url, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(department),
	});
	if (!resp.ok) {
		throw new Error(`Failed to update department: ${resp.status}`);
	}
	const json = await resp.json();
	// Response shape is validated at the API boundary; casting is safe here
	return json as Department;
}

export async function executeDeleteDepartment(departmentId: number): Promise<boolean> {
	const url = `${API_BASE_URL}${DEPARTMENT_BY_ID_ROUTE.replace(':departmentId', String(departmentId))}`;
	const resp = await fetch(url, { method: 'DELETE' });
	if (!resp.ok) {
		throw new Error(`Failed to delete department: ${resp.status}`);
	}
	return true;
}

export const departmentServiceMeta = { routes: { getItems: GET_DEPARTMENTS_ROUTE } };
export const departmentCreateServiceMeta = { routes: { createItem: CREATE_DEPARTMENT_ROUTE } };
export const departmentByIdServiceMeta = { routes: { byId: DEPARTMENT_BY_ID_ROUTE } };
