
import { createMockResponseFactory } from '@/msw/mswUtils';

import type { Employee } from '../types';
import { employeeCreateServiceMeta } from './employeeService';
import { employeeDb } from './mockEmployeeData';


const createEmployeeFactory = createMockResponseFactory(employeeCreateServiceMeta.routes.createItem);

const createItem = createEmployeeFactory.post.json<Omit<Employee, 'id'>, Employee>(
	({ content }) => {
		const newEmployee = employeeDb.create(content);
		return newEmployee;
	});

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswEmployeeCreateService = [createItem];
// To quickly simulate a specific status response, you can use the built in factory statusResponse options, for example:
// [createEmployeeFactory.post.statusResponses.status500];