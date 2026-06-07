import { http, HttpResponse } from 'msw';

import { UrlParams } from '@/msw/core_msw';
import { createMockResponseFactory, mockApiUrl } from '@/msw/mswUtils';

import { type DTO_CreateLocationRequest, type DTO_GetLocationsResponse, type DTO_UpdateLocationRequest, type LocationRouteParams, locationServiceMeta } from './locationService';
import { addLocation, isLocationInUse, mockLocations, removeLocation, updateLocation } from './mockSettingsData';

const getLocationsFactory = createMockResponseFactory(locationServiceMeta.routes.getLocations);
const locationFactory = createMockResponseFactory(locationServiceMeta.routes.location);

const getLocationsHandler = getLocationsFactory.get.json<DTO_GetLocationsResponse>(
	() => ({ locations: mockLocations })
);

const createLocationHandler = getLocationsFactory.post.json<DTO_CreateLocationRequest, void>(
	({ content }) => {
		addLocation(content.name);
	}
);

const updateLocationHandler = locationFactory.put.json<DTO_UpdateLocationRequest, void, UrlParams<LocationRouteParams>>(
	({ content, routeParams }) => {
		updateLocation(Number(routeParams.locationId), content.name);
	}
);

const deleteLocationHandler = http.delete<UrlParams<LocationRouteParams>>(
	mockApiUrl(locationServiceMeta.routes.location),
	({ params }) => {
		const locationId = Number(params.locationId);
		if (isLocationInUse(locationId)) {
			return new HttpResponse(null, { status: 409, statusText: 'Conflict - location has assigned employees' });
		}
		removeLocation(locationId);
		return new HttpResponse(null, { status: 200 });
	}
);

// IMPORTANT - Services must be added to the /src/msw/mswBrowser.ts file to have them included in the browser mock service worker setup.
export const mswLocationService = [getLocationsHandler, createLocationHandler, updateLocationHandler, deleteLocationHandler];
// To quickly simulate a specific status response, you can use the built in factory statusResponse options, for example:
// [getLocationsFactory.get.statusResponses.status500];
