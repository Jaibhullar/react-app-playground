import { API_BASE_URL } from '@/common/constants';

import type { GetRolesResponse, Role } from '../types';

const GET_ROLES_ROUTE = '/roles' as const;

/** Shared route for update and delete operations on a single role. */
const ROLE_BY_ID_ROUTE = '/role/:roleId' as const;

const CREATE_ROLE_ROUTE = '/role' as const;

export async function executeGetRoles(): Promise<GetRolesResponse> {
	const resp = await fetch(`${API_BASE_URL}${GET_ROLES_ROUTE}`);
	if (!resp.ok) {
		throw new Error(`Failed to fetch roles: ${resp.status}`);
	}
	const json = await resp.json();
	// Response shape is validated at the API boundary; casting is safe here
	return json as GetRolesResponse;
}

export async function executeCreateRole(name: string): Promise<Role> {
	const resp = await fetch(`${API_BASE_URL}${CREATE_ROLE_ROUTE}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name }),
	});
	if (!resp.ok) {
		throw new Error(`Failed to create role: ${resp.status}`);
	}
	const json = await resp.json();
	// Response shape is validated at the API boundary; casting is safe here
	return json as Role;
}

export async function executeUpdateRole(role: Role): Promise<Role> {
	const url = `${API_BASE_URL}${ROLE_BY_ID_ROUTE.replace(':roleId', String(role.id))}`;
	const resp = await fetch(url, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(role),
	});
	if (!resp.ok) {
		throw new Error(`Failed to update role: ${resp.status}`);
	}
	const json = await resp.json();
	// Response shape is validated at the API boundary; casting is safe here
	return json as Role;
}

export async function executeDeleteRole(roleId: number): Promise<boolean> {
	const url = `${API_BASE_URL}${ROLE_BY_ID_ROUTE.replace(':roleId', String(roleId))}`;
	const resp = await fetch(url, { method: 'DELETE' });
	if (!resp.ok) {
		throw new Error(`Failed to delete role: ${resp.status}`);
	}
	return true;
}

export const roleServiceMeta = { routes: { getItems: GET_ROLES_ROUTE } };
export const roleCreateServiceMeta = { routes: { createItem: CREATE_ROLE_ROUTE } };
export const roleByIdServiceMeta = { routes: { byId: ROLE_BY_ID_ROUTE } };
