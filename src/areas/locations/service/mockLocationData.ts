import { employeeDb } from '@/areas/employees/service/mockEmployeeData';

import type { Location } from '../types';

let nextId = 2;

const locations: Location[] = [
	{ id: 0, name: 'San Francisco' },
	{ id: 1, name: 'New York' },
];

export const locationDb = {
	getAll: (): Location[] => [...locations],

	getAssignedCount: (id: number): number =>
		employeeDb.getAll().filter(e => e.location.id === id).length,

	findByName: (name: string): Location | undefined =>
		locations.find(l => l.name.toLowerCase() === name.toLowerCase()),

	getById: (id: number): Location | undefined => locations.find(l => l.id === id),

	create: (name: string): Location => {
		const location: Location = { id: nextId, name };
		locations.push(location);
		nextId++;
		return location;
	},

	update: (updated: Location): Location | null => {
		const index = locations.findIndex(l => l.id === updated.id);
		if (index === -1) return null;
		locations[index] = { ...updated };
		return locations[index];
	},

	delete: (id: number): boolean => {
		const index = locations.findIndex(l => l.id === id);
		if (index === -1) return false;
		locations.splice(index, 1);
		return true;
	},

	reset: (): void => {
		locations.length = 0;
		locations.push(
			{ id: 0, name: 'San Francisco' },
			{ id: 1, name: 'New York' }
		);
		nextId = 2;
	},
};
