export type Employee = {
	id: number,
	name: string,
	department: Department,
	location: EmployeeLocation,
	role: EmployeeRole,
};

export type Department = {
	id: number,
	name: string,
	/** Hex colour string used to tint the department badge, e.g. '#6366f1' */
	color: string,
};

export type EmployeeLocation = {
	id: number,
	name: string,
};

export type EmployeeRole = {
	id: number,
	name: string,
};

export type EmployeeDetail = Employee & {
	email: string,
	phone: string,
	startDate: string,
	hierarchy: Hierarchy,
};

export type Hierarchy = {
	managers: Employee[],
	subordinates: Employee[],
	directPeers: Employee[],
};

export type EmployeeFormValues = {
	name: string,
	email: string,
	phone: string,
	startDate: string,
	departmentId: number,
	locationId: number,
	roleId: number,
};