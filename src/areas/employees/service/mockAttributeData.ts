import type { Department, EmployeeRole, Location } from '../types';

export const SEED_DEPARTMENTS: Department[] = [
	{ id: 0, name: 'Engineering', color: '#6366f1' },
	{ id: 1, name: 'Design', color: '#ec4899' },
	{ id: 2, name: 'Product', color: '#f59e0b' },
	{ id: 3, name: 'HR', color: '#10b981' },
	{ id: 4, name: 'Sales', color: '#3b82f6' },
	{ id: 5, name: 'Finance', color: '#8b5cf6' },
];

export const SEED_LOCATIONS: Location[] = [
	{ id: 0, name: 'San Francisco' },
	{ id: 1, name: 'New York' },
	{ id: 2, name: 'London' },
	{ id: 3, name: 'Austin' },
];

export const SEED_ROLES: EmployeeRole[] = [
	{ id: 0, name: 'Software Engineer' },
	{ id: 1, name: 'Product Manager' },
	{ id: 2, name: 'Designer' },
	{ id: 3, name: 'Data Analyst' },
	{ id: 4, name: 'Marketing Specialist' },
	{ id: 5, name: 'HR Manager' },
];
