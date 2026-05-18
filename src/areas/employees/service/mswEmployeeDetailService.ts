

import { UrlParams } from '@/msw/core_msw';
import { createMockResponseFactory } from '@/msw/mswUtils';

import type { GetEmployeeDetailRequest, GetEmployeeDetailResponse } from '../types';
import { employeeDetailServiceMeta } from './employeeService';
import { getEmployeeDetail } from './mockEmployeeData';


const getEmployeeDetailFactory = createMockResponseFactory(employeeDetailServiceMeta.routes.getItemDetail);

const getItem = getEmployeeDetailFactory.get.json<GetEmployeeDetailResponse, UrlParams<GetEmployeeDetailRequest>>(
	({ routeParams }) => ({
		employee: getEmployeeDetail(Number(routeParams.employeeId)),
	}));

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswEmployeeDetailService = [getItem];
// To quickly simulate a specific status response, you can use the built in factory statusResponse options, for example:
// [getItemFactory.get.statusResponses.status500];