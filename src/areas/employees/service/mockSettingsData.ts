import type { Department, EmployeeRole, Location } from '../types';
import { SEED_DEPARTMENTS, SEED_LOCATIONS, SEED_ROLES } from './mockAttributeData';
import { mockEmployees } from './mockEmployeeData';

// Mutable copies — spread so runtime add/update/delete don't mutate the seed constants.
export const mockDepartments: Department[] = [...SEED_DEPARTMENTS];
export const mockLocations: Location[] = [...SEED_LOCATIONS];
export const mockRoles: EmployeeRole[] = [...SEED_ROLES];

let nextDepartmentId = mockDepartments.length;
let nextLocationId = mockLocations.length;
let nextRoleId = mockRoles.length;

export function isDepartmentInUse(departmentId: number): boolean {
	return mockEmployees.some(e => e.department.id === departmentId);
}

export function countEmployeesInDepartment(departmentId: number): number {
	return mockEmployees.filter(e => e.department.id === departmentId).length;
}

export function isLocationInUse(locationId: number): boolean {
	return mockEmployees.some(e => e.location.id === locationId);
}

export function countEmployeesInLocation(locationId: number): number {
	return mockEmployees.filter(e => e.location.id === locationId).length;
}

export function isRoleInUse(roleId: number): boolean {
	return mockEmployees.some(e => e.role.id === roleId);
}

export function countEmployeesInRole(roleId: number): number {
	return mockEmployees.filter(e => e.role.id === roleId).length;
}

export function addDepartment(name: string, color: string): Department {
	const department: Department = { id: nextDepartmentId++, name, color };
	mockDepartments.push(department);
	return department;
}

export function updateDepartment(departmentId: number, name: string, color: string): Department | undefined {
	const department = mockDepartments.find(d => d.id === departmentId);
	if (!department) return undefined;
	department.name = name;
	department.color = color;
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
