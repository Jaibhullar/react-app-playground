import type { Department, EmployeeRole, Location } from '../types';
import { mockEmployees } from './mockEmployeeData';

export const mockDepartments: Department[] = [
	{ id: 0, name: 'Engineering' },
	{ id: 1, name: 'Marketing' },
	{ id: 2, name: 'Human Resources' },
];

export const mockLocations: Location[] = [
	{ id: 0, name: 'San Francisco' },
	{ id: 1, name: 'New York' },
];

export const mockRoles: EmployeeRole[] = [
	{ id: 0, name: 'Software Engineer' },
	{ id: 1, name: 'Product Manager' },
	{ id: 2, name: 'Designer' },
	{ id: 3, name: 'Data Analyst' },
];

let nextDepartmentId = mockDepartments.length;
let nextLocationId = mockLocations.length;
let nextRoleId = mockRoles.length;

export function isDepartmentInUse(departmentId: number): boolean {
	return mockEmployees.some(e => e.department.id === departmentId);
}

export function isLocationInUse(locationId: number): boolean {
	return mockEmployees.some(e => e.location.id === locationId);
}

export function isRoleInUse(roleId: number): boolean {
	return mockEmployees.some(e => e.role.id === roleId);
}

export function addDepartment(name: string): Department {
	const department: Department = { id: nextDepartmentId++, name };
	mockDepartments.push(department);
	return department;
}

export function updateDepartment(departmentId: number, name: string): Department | undefined {
	const department = mockDepartments.find(d => d.id === departmentId);
	if (!department) return undefined;
	department.name = name;
	return department;
}

export function removeDepartment(departmentId: number): void {
	const index = mockDepartments.findIndex(d => d.id === departmentId);
	if (index !== -1) mockDepartments.splice(index, 1);
}

export function addLocation(name: string): Location {
	const location: Location = { id: nextLocationId++, name };
	mockLocations.push(location);
	return location;
}

export function updateLocation(locationId: number, name: string): Location | undefined {
	const location = mockLocations.find(l => l.id === locationId);
	if (!location) return undefined;
	location.name = name;
	return location;
}

export function removeLocation(locationId: number): void {
	const index = mockLocations.findIndex(l => l.id === locationId);
	if (index !== -1) mockLocations.splice(index, 1);
}

export function addRole(name: string): EmployeeRole {
	const role: EmployeeRole = { id: nextRoleId++, name };
	mockRoles.push(role);
	return role;
}

export function updateRole(roleId: number, name: string): EmployeeRole | undefined {
	const role = mockRoles.find(r => r.id === roleId);
	if (!role) return undefined;
	role.name = name;
	return role;
}

export function removeRole(roleId: number): void {
	const index = mockRoles.findIndex(r => r.id === roleId);
	if (index !== -1) mockRoles.splice(index, 1);
}
