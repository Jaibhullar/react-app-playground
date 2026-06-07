export type Role = {
	id: number,
	name: string,
};

export type RoleListItem = Role & {
	assignedEmployeeCount: number,
};

export type GetRolesResponse = {
	roles: RoleListItem[],
};

export type RoleFormValues = {
	name: string,
};

export type RoleFormDrawerState =
	| {
		mode: 'create',
	}
	| {
		mode: 'edit',
		role: RoleListItem,
	}
	| null;
