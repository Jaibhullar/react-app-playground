import { HttpHandler } from 'msw';
import { setupWorker } from 'msw/browser';

import { mswDemoItemService } from '@/areas/demo/service/mswDemoItemService';
import { mswEmployeeDetailService } from '@/areas/employees/service/mswEmployeeDetailService';
import { mswEmployeeFiltersService } from '@/areas/employees/service/mswEmployeeFiltersService';
import { mswEmployeeService } from '@/areas/employees/service/mswEmployeeService';

import { outputHandlersToConsole } from './core_msw';

function getActiveHandlers() {
	// IMPORT AND ADD MOCK HANDLER ARRAYS INTO THIS ARRAY
	const handlers: HttpHandler[][] = [
		mswDemoItemService,
		mswEmployeeService,
		mswEmployeeDetailService,
		mswEmployeeFiltersService,
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