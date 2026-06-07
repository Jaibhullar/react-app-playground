import { employeeDb } from '@/areas/employees/service/mockEmployeeData';

import type { Role } from '../types';

let nextId = 4;

const roles: Role[] = [
	{ id: 0, name: 'Software Engineer' },
	{ id: 1, name: 'Product Manager' },
	{ id: 2, name: 'Designer' },
	{ id: 3, name: 'Data Analyst' },
];

export const roleDb = {
	getAll: (): Role[] => [...roles],

	getAssignedCount: (id: number): number =>
		employeeDb.getAll().filter(e => e.role.id === id).length,

	findByName: (name: string): Role | undefined =>
		roles.find(r => r.name.toLowerCase() === name.toLowerCase()),

	getById: (id: number): Role | undefined => roles.find(r => r.id === id),

	create: (name: string): Role => {
		const role: Role = { id: nextId, name };
		roles.push(role);
		nextId++;
		return role;
	},

	update: (updated: Role): Role | null => {
		const index = roles.findIndex(r => r.id === updated.id);
		if (index === -1) return null;
		roles[index] = { ...updated };
		return roles[index];
	},

	delete: (id: number): boolean => {
		const index = roles.findIndex(r => r.id === id);
		if (index === -1) return false;
		roles.splice(index, 1);
		return true;
	},

	reset: (): void => {
		roles.length = 0;
		roles.push(
			{ id: 0, name: 'Software Engineer' },
			{ id: 1, name: 'Product Manager' },
			{ id: 2, name: 'Designer' },
			{ id: 3, name: 'Data Analyst' }
		);
		nextId = 4;
	},
};
