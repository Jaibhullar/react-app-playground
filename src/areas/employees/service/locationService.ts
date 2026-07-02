import { API_BASE_URL } from '@/common/constants';

import type { EmployeeLocation } from '../types';

// --- Domain Types ---

export type LocationWithCount = EmployeeLocation & {
	totalEmployees: number,
};

export type GetLocationsResponse = {
	locations: LocationWithCount[],
};

export type CreateLocationRequest = {
	name: string,
};

export type UpdateLocationRequest = {
	locationId: number,
	name: string,
};

export type DeleteLocationRequest = {
	locationId: number,
	reassignToId?: number,
};

export type LocationRouteParams = {
	locationId: number,
};

// --- Query Keys ---

export const LOCATIONS_QUERY_KEY = ['settings', 'locations'] as const;

// --- Error Codes ---

export const LOCATION_IN_USE_ERROR = 'LOCATION_IN_USE' as const;

// --- Routes ---

const getLocationsRoute = '/settings/locations' as const;
const locationRoute = '/settings/locations/:locationId' as const;

// --- Helpers ---

function getLocationUrl(locationId: number): string {
	return `${API_BASE_URL}${locationRoute.replace(':locationId', String(locationId))}`;
}

// --- Service Functions ---

// Note there is no error handling on GET and we are using base fetch here for demo simplicity.
export async function executeGetLocations(): Promise<GetLocationsResponse> {
	const response = await fetch(`${API_BASE_URL}${getLocationsRoute}`);
	const json = await response.json();
	return json as GetLocationsResponse;
}

export async function executeCreateLocation(request: CreateLocationRequest): Promise<void> {
	const response = await fetch(`${API_BASE_URL}${getLocationsRoute}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(request),
	});
	if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
}

export async function executeUpdateLocation(request: UpdateLocationRequest): Promise<void> {
	const { name } = request;
	const response = await fetch(getLocationUrl(request.locationId), {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name }),
	});
	if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
}

export async function executeDeleteLocation(request: DeleteLocationRequest): Promise<void> {
	const baseUrl = getLocationUrl(request.locationId);
	const url = request.reassignToId !== undefined ? `${baseUrl}?reassignToId=${request.reassignToId}` : baseUrl;
	const response = await fetch(url, { method: 'DELETE' });
	if (response.status === 409) throw new Error(LOCATION_IN_USE_ERROR);
	if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
}

// --- Meta ---

export const locationServiceMeta = {
	routes: {
		getLocations: getLocationsRoute,
		location: locationRoute,
	},
};
