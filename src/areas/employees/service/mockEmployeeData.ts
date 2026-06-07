import { DTO_Employee, DTO_EmployeeDetail } from './employeeService';
import { SEED_DEPARTMENTS, SEED_LOCATIONS, SEED_ROLES } from './mockAttributeData';

let idCounter = 0;

// Internal storage shape. The list endpoint returns the slim DTO_Employee shape;
// the detail endpoint surfaces email/phone. Storing them here means new employees
// keep whatever the user submitted instead of being overwritten by a generator.
type StoredEmployee = DTO_Employee & {
	email: string,
	phone: string,
	startDate: string,
};

function generateSeedEmail(name: string): string {
	return `${name.toLowerCase().replace(' ', '.')}@example.com`;
}

function generateSeedPhone(id: number): string {
	return `555-01${id.toString().padStart(2, '0')}`;
}

function generateSeedStartDate(id: number): string {
	const year = 2015 + (id % 8);
	const month = (id % 12) + 1;
	const day = (id % 28) + 1;
	return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
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

function createData(departmentIdx: number, locationIdx: number, roleIdx: number): StoredEmployee {
	const department = SEED_DEPARTMENTS[departmentIdx % SEED_DEPARTMENTS.length]!;
	const location = SEED_LOCATIONS[locationIdx % SEED_LOCATIONS.length]!;
	const role = SEED_ROLES[roleIdx % SEED_ROLES.length]!;
	return {
		id: idCounter,
		name: getRealisticName(idCounter),
		department,
		location,
		role,
		email: generateSeedEmail(getRealisticName(idCounter)),
		phone: generateSeedPhone(idCounter),
		startDate: generateSeedStartDate(idCounter),
	};
}

const generateDataSet = (count: number): StoredEmployee[] => {
	const dataSet: StoredEmployee[] = [];
	for (let i = 1; i <= count; i++) {
		idCounter++;
		dataSet.push(createData(
			i % SEED_DEPARTMENTS.length,
			i % SEED_LOCATIONS.length,
			i % SEED_ROLES.length
		));
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

export type EmployeeMutableFields = {
	name: string,
	email: string,
	phone: string,
	startDate: string,
	department: {
		id: number, name: string, color: string,
	},
	location: {
		id: number, name: string,
	},
	role: {
		id: number, name: string,
	},
};

export function addEmployee(fields: EmployeeMutableFields): DTO_Employee {
	idCounter++;
	const employee: StoredEmployee = { id: idCounter, ...fields };
	mockEmployees.push(employee);
	return employee;
}

export function updateEmployee(employeeId: number, fields: EmployeeMutableFields): DTO_Employee | undefined {
	const employee = mockEmployees.find(e => e.id === employeeId);
	if (!employee) return undefined;
	employee.name = fields.name;
	employee.email = fields.email;
	employee.phone = fields.phone;
	employee.department = fields.department;
	employee.location = fields.location;
	employee.role = fields.role;
	return employee;
}

export function removeEmployee(employeeId: number): void {
	const index = mockEmployees.findIndex(e => e.id === employeeId);
	if (index !== -1) mockEmployees.splice(index, 1);
}