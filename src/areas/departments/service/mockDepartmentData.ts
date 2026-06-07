import { employeeDb } from '@/areas/employees/service/mockEmployeeData';

import type { Department } from '../types';

let nextId = 3;

const departments: Department[] = [
	{ id: 0, name: 'Engineering' },
	{ id: 1, name: 'Marketing' },
	{ id: 2, name: 'Human Resources' },
];

export const departmentDb = {
	getAll: (): Department[] => [...departments],

	getAssignedCount: (id: number): number =>
		employeeDb.getAll().filter(e => e.department.id === id).length,

	findByName: (name: string): Department | undefined =>
		departments.find(d => d.name.toLowerCase() === name.toLowerCase()),

	getById: (id: number): Department | undefined => departments.find(d => d.id === id),

	create: (name: string): Department => {
		const department: Department = { id: nextId, name };
		departments.push(department);
		nextId++;
		return department;
	},

	update: (updated: Department): Department | null => {
		const index = departments.findIndex(d => d.id === updated.id);
		if (index === -1) return null;
		departments[index] = { ...updated };
		return departments[index];
	},

	delete: (id: number): boolean => {
		const index = departments.findIndex(d => d.id === id);
		if (index === -1) return false;
		departments.splice(index, 1);
		return true;
	},

	reset: (): void => {
		departments.length = 0;
		departments.push(
			{ id: 0, name: 'Engineering' },
			{ id: 1, name: 'Marketing' },
			{ id: 2, name: 'Human Resources' }
		);
		nextId = 3;
	},
};
