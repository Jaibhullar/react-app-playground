import { useCallback, useState } from 'react';

import type { Employee, EmployeeFormDrawerState } from '../../types';

export type UseEmployeeFormDrawerReturn = {
	drawerState: EmployeeFormDrawerState,
	isOpen: boolean,
	openCreate: () => void,
	openEdit: (employee: Employee) => void,
	close: () => void,
};

export const useEmployeeFormDrawer = (): UseEmployeeFormDrawerReturn => {
	const [drawerState, setDrawerState] = useState<EmployeeFormDrawerState>(null);

	const openCreate = useCallback(() => {
		setDrawerState({ mode: 'create' });
	}, []);

	const openEdit = useCallback((employee: Employee) => {
		setDrawerState({ mode: 'edit', employee });
	}, []);

	const close = useCallback(() => {
		setDrawerState(null);
	}, []);

	return {
		drawerState,
		isOpen: drawerState !== null,
		openCreate,
		openEdit,
		close,
	};
};
