import { DTO_Employee } from './employeeService';

const idCounter = 0;

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

export const mockData = generateDataSet(15);