import { HttpHandler } from 'msw';
import { setupWorker } from 'msw/browser';

import { mswDemoItemService } from '@/areas/demo/service/mswDemoItemService';
import { mswDepartmentService } from '@/areas/employees/service/mswDepartmentService';
import { mswEmployeeDetailService } from '@/areas/employees/service/mswEmployeeDetailService';
import { mswEmployeeService } from '@/areas/employees/service/mswEmployeeService';
import { mswLocationService } from '@/areas/employees/service/mswLocationService';
import { mswRoleService } from '@/areas/employees/service/mswRoleService';

import { outputHandlersToConsole } from './core_msw';

function getActiveHandlers() {
	// IMPORT AND ADD MOCK HANDLER ARRAYS INTO THIS ARRAY
	const handlers: HttpHandler[][] = [
		mswDemoItemService,
		mswEmployeeService,
		mswEmployeeDetailService,
		mswDepartmentService,
		mswLocationService,
		mswRoleService,
	];
	return handlers;
}

/** Constructs a msw worker setup for application service mocks */
export const getWorker = async () => {
	const handlers = getActiveHandlers().flat();
	const worker = setupWorker(...handlers);
	outputHandlersToConsole(handlers);
	return worker;
};