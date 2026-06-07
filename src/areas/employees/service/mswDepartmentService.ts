import { http, HttpResponse } from 'msw';

import { UrlParams } from '@/msw/core_msw';
import { createMockResponseFactory, mockApiUrl } from '@/msw/mswUtils';

import { type CreateDepartmentRequest, type DepartmentRouteParams, departmentServiceMeta, type GetDepartmentsResponse, type UpdateDepartmentRequest } from './departmentService';
import { addDepartment, countEmployeesInDepartment, isDepartmentInUse, mockDepartments, removeDepartment, updateDepartment } from './mockSettingsData';

const DEFAULT_DEPARTMENT_COLOR = '#6366f1' as const;

const getDepartmentsFactory = createMockResponseFactory(departmentServiceMeta.routes.getDepartments);
const departmentFactory = createMockResponseFactory(departmentServiceMeta.routes.department);

const getDepartmentsHandler = getDepartmentsFactory.get.json<GetDepartmentsResponse>(
	() => ({
		departments: mockDepartments.map(d => ({
			...d,
			totalEmployees: countEmployeesInDepartment(d.id),
		})),
	})
);

const createDepartmentHandler = getDepartmentsFactory.post.json<CreateDepartmentRequest, void>(
	({ content }) => {
		addDepartment(content.name, content.color ?? DEFAULT_DEPARTMENT_COLOR);
	}
);

const updateDepartmentHandler = departmentFactory.put.json<Pick<UpdateDepartmentRequest, 'name' | 'color'>, void, UrlParams<DepartmentRouteParams>>(
	({ content, routeParams }) => {
		updateDepartment(Number(routeParams.departmentId), content.name, content.color ?? DEFAULT_DEPARTMENT_COLOR);
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
