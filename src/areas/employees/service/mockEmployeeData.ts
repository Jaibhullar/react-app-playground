import { DTO_Employee, DTO_EmployeeDetail } from './employeeService';

let idCounter = 0;

const departmentNames: Record<number, string> = {
	0: 'Engineering',
	1: 'Marketing',
	2: 'Human Resources',
};

const locationNames: Record<number, string> = {
	0: 'San Francisco',
	1: 'New York',
};

const roleNames: Record<number, string> = {
	0: 'Software Engineer',
	1: 'Product Manager',
	2: 'Designer',
	3: 'Data Analyst',
};

const employeeFirstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Cameron', 'Dakota', 'Skyler', 'Jamie', 'Reese', 'Sage', 'Finley'];
const employeeLastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson'];

function getRealisticName(index: number): string {
	const firstName = employeeFirstNames[index % employeeFirstNames.length];
	const lastName = employeeLastNames[(index * 7) % employeeLastNames.length];
	return `${firstName} ${lastName}`;
}

function getDepartmentName(id: number): string {
	return departmentNames[id] ?? `Department ${id}`;
}

function getLocationName(id: number): string {
	return locationNames[id] ?? `Location ${id}`;
}

function getRoleName(id: number): string {
	return roleNames[id] ?? `Role ${id}`;
}

function createData(name: string, departmentId: number, departmentName: string, locationId: number, locationName: string, roleId: number, roleName: string): DTO_Employee {
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
	const dataSet: DTO_Employee[] = [];
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

export function getEmployeeDetail (employeeId:number):DTO_EmployeeDetail | undefined {
	console.log('Getting detail for employee ID:', employeeId);
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