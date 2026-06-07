import { API_BASE_URL } from '@/common/constants';

import type { EmployeeRole } from '../types';

// --- DTOs ---

export type DTO_EmployeeRole = {
	id: number,
	name: string,
};

export type DTO_GetRolesResponse = {
	roles: DTO_EmployeeRole[],
};

export type DTO_CreateRoleRequest = {
	name: string,
};

export type DTO_UpdateRoleRequest = {
	name: string,
};

// --- Domain Types ---

export type GetRolesResponse = {
	roles: EmployeeRole[],
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

function transformDTO(dto: DTO_EmployeeRole): EmployeeRole {
	return { id: dto.id, name: dto.name };
}

// --- Service Functions ---

// Note there is no error handling on GET and we are using base fetch here for demo simplicity.
export async function executeGetRoles(): Promise<GetRolesResponse> {
	return fetch(`${API_BASE_URL}${getRolesRoute}`)
		.then(response => response.json())
		.then(json => {
			const responseDTO = json as DTO_GetRolesResponse;
			return { roles: responseDTO.roles.map(transformDTO) };
		});
}

export async function executeCreateRole(request: CreateRoleRequest): Promise<void> {
	const body: DTO_CreateRoleRequest = { name: request.name };
	const response = await fetch(`${API_BASE_URL}${getRolesRoute}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
	if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
}

export async function executeUpdateRole(request: UpdateRoleRequest): Promise<void> {
	const body: DTO_UpdateRoleRequest = { name: request.name };
	const response = await fetch(getRoleUrl(request.roleId), {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
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
