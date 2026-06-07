import { HttpHandler } from 'msw';
import { setupWorker } from 'msw/browser';

import { mswDemoItemService } from '@/areas/demo/service/mswDemoItemService';
import { mswDepartmentCreateService } from '@/areas/departments/service/mswDepartmentCreateService';
import { mswDepartmentDeleteService } from '@/areas/departments/service/mswDepartmentDeleteService';
import { mswDepartmentService } from '@/areas/departments/service/mswDepartmentService';
import { mswDepartmentUpdateService } from '@/areas/departments/service/mswDepartmentUpdateService';
import { mswEmployeeCreateService } from '@/areas/employees/service/mswEmployeeCreateService';
import { mswEmployeeDeleteService } from '@/areas/employees/service/mswEmployeeDeleteService';
import { mswEmployeeDetailService } from '@/areas/employees/service/mswEmployeeDetailService';
import { mswEmployeeFiltersService } from '@/areas/employees/service/mswEmployeeFiltersService';
import { mswEmployeeService } from '@/areas/employees/service/mswEmployeeService';
import { mswEmployeeUpdateService } from '@/areas/employees/service/mswEmployeeUpdateService';
import { mswLocationCreateService } from '@/areas/locations/service/mswLocationCreateService';
import { mswLocationDeleteService } from '@/areas/locations/service/mswLocationDeleteService';
import { mswLocationService } from '@/areas/locations/service/mswLocationService';
import { mswLocationUpdateService } from '@/areas/locations/service/mswLocationUpdateService';
import { mswRoleCreateService } from '@/areas/roles/service/mswRoleCreateService';
import { mswRoleDeleteService } from '@/areas/roles/service/mswRoleDeleteService';
import { mswRoleService } from '@/areas/roles/service/mswRoleService';
import { mswRoleUpdateService } from '@/areas/roles/service/mswRoleUpdateService';

import { outputHandlersToConsole } from './core_msw';

function getActiveHandlers() {
	// IMPORT AND ADD MOCK HANDLER ARRAYS INTO THIS ARRAY
	const handlers: HttpHandler[][] = [
		mswDemoItemService,
		mswDepartmentService,
		mswDepartmentCreateService,
		mswDepartmentUpdateService,
		mswDepartmentDeleteService,
		mswEmployeeService,
		mswEmployeeDetailService,
		mswEmployeeFiltersService,
		mswEmployeeDeleteService,
		mswEmployeeCreateService,
		mswEmployeeUpdateService,
		mswLocationService,
		mswLocationCreateService,
		mswLocationUpdateService,
		mswLocationDeleteService,
		mswRoleService,
		mswRoleCreateService,
		mswRoleUpdateService,
		mswRoleDeleteService,
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