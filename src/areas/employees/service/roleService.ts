import { API_BASE_URL } from '@/common/constants';

import type { EmployeeRole } from '../types';

// --- Domain Types ---

export type RoleWithCount = EmployeeRole & {
	totalEmployees: number,
};

export type GetRolesResponse = {
	roles: RoleWithCount[],
};

export type CreateRoleRequest = {
	name: string,
};

export type UpdateRoleRequest = {
	roleId: number,
	name: string,
};

export type DeleteRoleRequest = {
	roleId: number,
};

export type RoleRouteParams = {
	roleId: number,
};

// --- Query Keys ---

export const ROLES_QUERY_KEY = ['settings', 'roles'] as const;

// --- Error Codes ---

export const ROLE_IN_USE_ERROR = 'ROLE_IN_USE' as const;

// --- Routes ---

const getRolesRoute = '/settings/roles' as const;
const roleRoute = '/settings/roles/:roleId' as const;

// --- Helpers ---

function getRoleUrl(roleId: number): string {
	return `${API_BASE_URL}${roleRoute.replace(':roleId', String(roleId))}`;
}

// --- Service Functions ---

// Note there is no error handling on GET and we are using base fetch here for demo simplicity.
export async function executeGetRoles(): Promise<GetRolesResponse> {
	return fetch(`${API_BASE_URL}${getRolesRoute}`)
		.then(response => response.json())
		.then(json => json as GetRolesResponse);
}

export async function executeCreateRole(request: CreateRoleRequest): Promise<void> {
	const response = await fetch(`${API_BASE_URL}${getRolesRoute}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(request),
	});
	if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
}

export async function executeUpdateRole(request: UpdateRoleRequest): Promise<void> {
	const { name } = request;
	const response = await fetch(getRoleUrl(request.roleId), {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name }),
	});
	if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
}

export async function executeDeleteRole(request: DeleteRoleRequest): Promise<void> {
	const response = await fetch(getRoleUrl(request.roleId), { method: 'DELETE' });
	if (response.status === 409) throw new Error(ROLE_IN_USE_ERROR);
	if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
}

// --- Meta ---

export const roleServiceMeta = {
	routes: {
		getRoles: getRolesRoute,
		role: roleRoute,
	},
};
