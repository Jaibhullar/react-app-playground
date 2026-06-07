export type Department = {
	id: number,
	name: string,
};

export type DepartmentListItem = Department & {
	assignedEmployeeCount: number,
};

export type GetDepartmentsResponse = {
	departments: DepartmentListItem[],
};

export type DepartmentFormValues = {
	name: string,
};

export type DepartmentFormDrawerState =
	| {
		mode: 'create',
	}
	| {
		mode: 'edit',
		department: DepartmentListItem,
	}
	| null;
