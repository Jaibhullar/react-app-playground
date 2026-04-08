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

export type GetEmployeesRequest = {
	filters?: EmployeeFilters,
	pagination?: EmployeePagination,
};

export type GetEmployeesResponse = {
	employees: Employee[],
	totalItems: number,
	currentPage: number,
	pageSize: number,
	totalPages: number,
};

export type GetEmployeeDetailRequest = {
	employeeId: number,
};

export type GetEmployeeDetailResponse = {
	employee: EmployeeDetail | undefined,
};

export type GetEmployeeFiltersResponse = {
	departments: {
		id: number, name: string,
	}[],
	locations: {
		id: number, name: string,
	}[],
	roles: {
		id: number, name: string,
	}[],
};

export type DeleteEmployeeRequest = {
	employeeId: number,
};

export type DeleteEmployeeResponse = {
	success: boolean,
};
