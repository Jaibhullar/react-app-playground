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
	search: string,
	departmentIds: number[] | 'all',
	locationIds: number[] | 'all',
	roleIds: number[] | 'all',
};

export type EmployeePagination = {
	currentPage?: number,
	pageSize?: number,
};

export type EmployeeDetail = Employee & {
	email: string,
	phone: string,
	hierarchy: Hierarchy,
};

export type Hierarchy = {
	managers: Employee[],
	subordinates: Employee[],
	directPeers: Employee[],
};