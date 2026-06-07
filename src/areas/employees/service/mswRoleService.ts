import { http, HttpResponse } from 'msw';

import { UrlParams } from '@/msw/core_msw';
import { createMockResponseFactory, mockApiUrl } from '@/msw/mswUtils';

import { addRole, countEmployeesInRole, isRoleInUse, mockRoles, reassignEmployeesFromRole, removeRole, updateRole } from './mockSettingsData';
import { type CreateRoleRequest, type GetRolesResponse, type RoleRouteParams, roleServiceMeta, type UpdateRoleRequest } from './roleService';

const getRolesFactory = createMockResponseFactory(roleServiceMeta.routes.getRoles);
const roleFactory = createMockResponseFactory(roleServiceMeta.routes.role);

const getRolesHandler = getRolesFactory.get.json<GetRolesResponse>(
	() => ({
		roles: mockRoles.map(r => ({
			...r,
			totalEmployees: countEmployeesInRole(r.id),
		})),
	})
);

const createRoleHandler = getRolesFactory.post.json<CreateRoleRequest, void>(
	({ content }) => {
		addRole(content.name);
	}
);

const updateRoleHandler = roleFactory.put.json<Pick<UpdateRoleRequest, 'name'>, void, UrlParams<RoleRouteParams>>(
	({ content, routeParams }) => {
		updateRole(Number(routeParams.roleId), content.name);
	}
);

const deleteRoleHandler = http.delete<UrlParams<RoleRouteParams>>(
	mockApiUrl(roleServiceMeta.routes.role),
	({ params, request }) => {
		const roleId = Number(params.roleId);
		const reassignToId = new URL(request.url).searchParams.get('reassignToId');
		if (reassignToId) {
			reassignEmployeesFromRole(roleId, Number(reassignToId));
		}
		else if (isRoleInUse(roleId)) {
			return new HttpResponse(null, { status: 409, statusText: 'Conflict - role has assigned employees' });
		}
		removeRole(roleId);
		return new HttpResponse(null, { status: 200 });
	}
);

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswRoleService = [getRolesHandler, createRoleHandler, updateRoleHandler, deleteRoleHandler];
// To quickly simulate a specific status response, you can use the built in factory statusResponse options, for example:
// [getRolesFactory.get.statusResponses.status500];
