export type Location = {
	id: number,
	name: string,
};

export type LocationListItem = Location & {
	assignedEmployeeCount: number,
};

export type GetLocationsResponse = {
	locations: LocationListItem[],
};

export type LocationFormValues = {
	name: string,
};

export type LocationFormDrawerState =
	| {
		mode: 'create',
	}
	| {
		mode: 'edit',
		location: LocationListItem,
	}
	| null;
