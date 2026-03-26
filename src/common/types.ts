export type Employee = {
	id: number,
	name: string,
	department: Department,
	location: Location,
	role: EmployeeRole,
};

export type Department = {
	id: number,
	name: string,
};

export type Location = {
	id: number,
	name: string,
};

export type EmployeeRole = {
	id: number,
	name: string,
};

export type EmployeeFilters = {
	departmentId?: number,
	locationId?: number,
	roleId?: number,
};