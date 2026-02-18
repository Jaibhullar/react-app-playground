

import { UrlParams } from '@/msw/core_msw';
import { createMockResponseFactory } from '@/msw/mswUtils';

import { DemoGetItemsRequest, demoServiceMeta, DTO_DemoGetItemsResponse } from './demoItemService';
import { mockData } from './mockDemoItemData';

const getItemsFactory = createMockResponseFactory(demoServiceMeta.routes.getItems);

const getItems = getItemsFactory.get.json<DTO_DemoGetItemsResponse, UrlParams<DemoGetItemsRequest>>(
	({ routeParams }) => ({
		items: mockData.filter(it => routeParams.status === 'all' || it.status === routeParams.status),
	}));

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswDemoItemService = [getItems];
// To quickly simulate a specific status response, you can use the built in factory statusResponse options, for example:
// [getItemsFactory.get.statusResponses.status500];
