import { setupServer } from 'msw/node';

import { mswDemoItemService } from '@/areas/demo/service/mswDemoItemService';
import { mswEmployeeDetailService } from '@/areas/employees/service/mswEmployeeDetailService';
import { mswEmployeeFiltersService } from '@/areas/employees/service/mswEmployeeFiltersService';
import { mswEmployeeService } from '@/areas/employees/service/mswEmployeeService';

const handlers = [
	...mswDemoItemService,
	...mswEmployeeService,
	...mswEmployeeDetailService,
	...mswEmployeeFiltersService,
];

export const mswServer = setupServer(...handlers);