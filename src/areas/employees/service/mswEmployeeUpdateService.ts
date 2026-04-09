
import { createMockResponseFactory } from '@/msw/mswUtils';

import type { Employee } from '../types';
import { employeeUpdateServiceMeta } from './employeeService';
import { employeeDb } from './mockEmployeeData';


const updateEmployeeFactory = createMockResponseFactory(employeeUpdateServiceMeta.routes.updateItem);

const updateItem = updateEmployeeFactory.put.json<Employee, Employee | null>(
	({ content }) => {
		const updatedEmployee = employeeDb.update(content);
		return updatedEmployee;
	});

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswEmployeeUpdateService = [updateItem];
// To quickly simulate a specific status response, you can use the built in factory statusResponse options, for example:
// [updateEmployeeFactory.post.statusResponses.status500];