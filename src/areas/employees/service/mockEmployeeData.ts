import type { Employee, EmployeeDetail } from '../types';

let idCounter = 0;

enum Department {
	Engineering = 'Engineering',
	Marketing = 'Marketing',
	HumanResources = 'Human Resources',
}

enum Location {
	SanFrancisco = 'San Francisco',
	NewYork = 'New York',
}

enum Role {
	SoftwareEngineer = 'Software Engineer',
	ProductManager = 'Product Manager',
	Designer = 'Designer',
	DataAnalyst = 'Data Analyst',
}

const employeeNames = [
	'Alex Smith', 'Jordan Johnson', 'Taylor Williams', 'Morgan Brown', 'Casey Jones',
	'Riley Garcia', 'Quinn Miller', 'Avery Davis', 'Cameron Martinez', 'Dakota Wilson',
	'Skyler Anderson', 'Jamie Thomas', 'Reese Taylor', 'Sage Moore', 'Finley Jackson',
	'Alex Johnson', 'Jordan Williams', 'Taylor Brown', 'Morgan Jones', 'Casey Garcia',
	'Riley Miller', 'Quinn Davis', 'Avery Martinez', 'Cameron Wilson', 'Dakota Anderson',
	'Skyler Thomas', 'Jamie Taylor', 'Reese Moore', 'Sage Jackson', 'Finley Smith',
];

function getRealisticName(index: number): string {
	return employeeNames[index % employeeNames.length];
}

function getDepartmentName(id: number): string {
	return Object.values(Department)[id] ?? `Department ${id}`;
}

function getLocationName(id: number): string {
	return Object.values(Location)[id] ?? `Location ${id}`;
}

function getRoleName(id: number): string {
	return Object.values(Role)[id] ?? `Role ${id}`;
}

function createData(name: string, departmentId: number, departmentName: string, locationId: number, locationName: string, roleId: number, roleName: string): Employee {
	return {
		id: idCounter,
		name,
		department: {
			id: departmentId,
			name: departmentName,
		},
		location: {
			id: locationId,
			name: locationName,
		},
		role: {
			id: roleId,
			name: roleName,
		},
	};
}

const generateDataSet = (count: number) => {
	const dataSet: Employee[] = [];
	for (let i = 1; i <= count; i++) {
		idCounter++;
		const departmentId = i % 3;
		const locationId = i % 2;
		const roleId = i % 4;
		dataSet.push(
			createData(
				getRealisticName(i),
				departmentId,
				getDepartmentName(departmentId),
				locationId,
				getLocationName(locationId),
				roleId,
				getRoleName(roleId)
			)
		);
	}
	return dataSet;
};

export const mockEmployees = generateDataSet(30);

export function getEmployeeDetail (employeeId:number):EmployeeDetail | undefined {
	const employee = mockEmployees.find(employee=>employee.id === employeeId);
	if (!employee) return undefined;

	return {
		...employee,
		email: `${employee.name.toLowerCase().replace(' ', '.')}@example.com`,
		phone: `555-01${employee.id.toString().padStart(2, '0')}`,
		hierarchy: {
			// Find some managers (could be employees with lower IDs, or same dept)
			managers: mockEmployees.filter(e => e.id < employee.id && e.department.id === employee.department.id).slice(0, 1),
			// Find subordinates (higher IDs, same dept)
			subordinates: mockEmployees.filter(e => e.id > employee.id && e.department.id === employee.department.id).slice(0, 3),
			// Find peers (same role, different person)
			directPeers: mockEmployees.filter(e => e.role.id === employee.role.id && e.id !== employee.id).slice(0, 2),
		},
	};
}