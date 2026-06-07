import { http, HttpResponse } from 'msw';

import { UrlParams } from '@/msw/core_msw';
import { createMockResponseFactory, mockApiUrl } from '@/msw/mswUtils';

import { type DepartmentRouteParams, departmentServiceMeta, type DTO_CreateDepartmentRequest, type DTO_GetDepartmentsResponse, type DTO_UpdateDepartmentRequest } from './departmentService';
import { addDepartment, isDepartmentInUse, mockDepartments, removeDepartment, updateDepartment } from './mockSettingsData';

const getDepartmentsFactory = createMockResponseFactory(departmentServiceMeta.routes.getDepartments);
const departmentFactory = createMockResponseFactory(departmentServiceMeta.routes.department);

const getDepartmentsHandler = getDepartmentsFactory.get.json<DTO_GetDepartmentsResponse>(
	() => ({ departments: mockDepartments })
);

const createDepartmentHandler = getDepartmentsFactory.post.json<DTO_CreateDepartmentRequest, void>(
	({ content }) => {
		addDepartment(content.name);
	}
);

const updateDepartmentHandler = departmentFactory.put.json<DTO_UpdateDepartmentRequest, void, UrlParams<DepartmentRouteParams>>(
	({ content, routeParams }) => {
		updateDepartment(Number(routeParams.departmentId), content.name);
	}
);

const deleteDepartmentHandler = http.delete<UrlParams<DepartmentRouteParams>>(
	mockApiUrl(departmentServiceMeta.routes.department),
	({ params }) => {
		const departmentId = Number(params.departmentId);
		if (isDepartmentInUse(departmentId)) {
			return new HttpResponse(null, { status: 409, statusText: 'Conflict - department has assigned employees' });
		}
		removeDepartment(departmentId);
		return new HttpResponse(null, { status: 200 });
	}
);

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswDepartmentService = [getDepartmentsHandler, createDepartmentHandler, updateDepartmentHandler, deleteDepartmentHandler];
// To quickly simulate a specific status response, you can use the built in factory statusResponse options, for example:
// [getDepartmentsFactory.get.statusResponses.status500];
