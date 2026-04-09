import { HttpHandler } from 'msw';
import { setupWorker } from 'msw/browser';

import { mswDemoItemService } from '@/areas/demo/service/mswDemoItemService';
import { mswEmployeeCreateService } from '@/areas/employees/service/mswEmployeeCreateService';
import { mswEmployeeDeleteService } from '@/areas/employees/service/mswEmployeeDeleteService';
import { mswEmployeeDetailService } from '@/areas/employees/service/mswEmployeeDetailService';
import { mswEmployeeFiltersService } from '@/areas/employees/service/mswEmployeeFiltersService';
import { mswEmployeeService } from '@/areas/employees/service/mswEmployeeService';
import { mswEmployeeUpdateService } from '@/areas/employees/service/mswEmployeeUpdateService';

import { outputHandlersToConsole } from './core_msw';

function getActiveHandlers() {
	// IMPORT AND ADD MOCK HANDLER ARRAYS INTO THIS ARRAY
	const handlers: HttpHandler[][] = [
		mswDemoItemService,
		mswEmployeeService,
		mswEmployeeDetailService,
		mswEmployeeFiltersService,
		mswEmployeeDeleteService,
		mswEmployeeCreateService,
		mswEmployeeUpdateService,
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