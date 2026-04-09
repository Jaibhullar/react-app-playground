
import { createMockResponseFactory } from '@/msw/mswUtils';

import { employeeDeleteServiceMeta } from './employeeService';
import { employeeDb } from './mockEmployeeData';


const deleteEmployeeFactory = createMockResponseFactory(employeeDeleteServiceMeta.routes.deleteItem);

const deleteItem = deleteEmployeeFactory.delete.paramsOnly(
	({ employeeId }) => {
		employeeDb.delete(Number(employeeId));
	});

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswEmployeeDeleteService = [deleteItem];
// To quickly simulate a specific status response, you can use the built in factory statusResponse options, for example:
// [deleteEmployeeFactory.delete.statusResponses.status500];
