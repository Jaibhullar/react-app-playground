import { API_BASE_URL } from '@/common/constants';

import type { GetLocationsResponse, Location } from '../types';

const GET_LOCATIONS_ROUTE = '/locations' as const;

/** Shared route for update and delete operations on a single location. */
const LOCATION_BY_ID_ROUTE = '/location/:locationId' as const;

const CREATE_LOCATION_ROUTE = '/location' as const;

export async function executeGetLocations(): Promise<GetLocationsResponse> {
	const resp = await fetch(`${API_BASE_URL}${GET_LOCATIONS_ROUTE}`);
	if (!resp.ok) {
		throw new Error(`Failed to fetch locations: ${resp.status}`);
	}
	const json = await resp.json();
	// Response shape is validated at the API boundary; casting is safe here
	return json as GetLocationsResponse;
}

export async function executeCreateLocation(name: string): Promise<Location> {
	const resp = await fetch(`${API_BASE_URL}${CREATE_LOCATION_ROUTE}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name }),
	});
	if (!resp.ok) {
		throw new Error(`Failed to create location: ${resp.status}`);
	}
	const json = await resp.json();
	// Response shape is validated at the API boundary; casting is safe here
	return json as Location;
}

export async function executeUpdateLocation(location: Location): Promise<Location> {
	const url = `${API_BASE_URL}${LOCATION_BY_ID_ROUTE.replace(':locationId', String(location.id))}`;
	const resp = await fetch(url, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(location),
	});
	if (!resp.ok) {
		throw new Error(`Failed to update location: ${resp.status}`);
	}
	const json = await resp.json();
	// Response shape is validated at the API boundary; casting is safe here
	return json as Location;
}

export async function executeDeleteLocation(locationId: number): Promise<boolean> {
	const url = `${API_BASE_URL}${LOCATION_BY_ID_ROUTE.replace(':locationId', String(locationId))}`;
	const resp = await fetch(url, { method: 'DELETE' });
	if (!resp.ok) {
		throw new Error(`Failed to delete location: ${resp.status}`);
	}
	return true;
}

export const locationServiceMeta = { routes: { getItems: GET_LOCATIONS_ROUTE } };
export const locationCreateServiceMeta = { routes: { createItem: CREATE_LOCATION_ROUTE } };
export const locationByIdServiceMeta = { routes: { byId: LOCATION_BY_ID_ROUTE } };
