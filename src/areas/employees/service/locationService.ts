import { API_BASE_URL } from '@/common/constants';

import type { Location } from '../types';

// --- DTOs ---

export type DTO_Location = {
	id: number,
	name: string,
};

export type DTO_GetLocationsResponse = {
	locations: DTO_Location[],
};

export type DTO_CreateLocationRequest = {
	name: string,
};

export type DTO_UpdateLocationRequest = {
	name: string,
};

// --- Domain Types ---

export type GetLocationsResponse = {
	locations: Location[],
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

function transformDTO(dto: DTO_Location): Location {
	return { id: dto.id, name: dto.name };
}

// --- Service Functions ---

// Note there is no error handling on GET and we are using base fetch here for demo simplicity.
export async function executeGetLocations(): Promise<GetLocationsResponse> {
	return fetch(`${API_BASE_URL}${getLocationsRoute}`)
		.then(response => response.json())
		.then(json => {
			const responseDTO = json as DTO_GetLocationsResponse;
			return { locations: responseDTO.locations.map(transformDTO) };
		});
}

export async function executeCreateLocation(request: CreateLocationRequest): Promise<void> {
	const body: DTO_CreateLocationRequest = { name: request.name };
	const response = await fetch(`${API_BASE_URL}${getLocationsRoute}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
	if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
}

export async function executeUpdateLocation(request: UpdateLocationRequest): Promise<void> {
	const body: DTO_UpdateLocationRequest = { name: request.name };
	const response = await fetch(getLocationUrl(request.locationId), {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
	if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
}

export async function executeDeleteLocation(request: DeleteLocationRequest): Promise<void> {
	const response = await fetch(getLocationUrl(request.locationId), { method: 'DELETE' });
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
