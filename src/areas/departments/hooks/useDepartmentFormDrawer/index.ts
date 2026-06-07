import { useState } from 'react';

import type { DepartmentFormDrawerState, DepartmentListItem } from '../../types';

export type UseDepartmentFormDrawerReturn = {
	drawerState: DepartmentFormDrawerState,
	isOpen: boolean,
	openCreate: () => void,
	openEdit: (department: DepartmentListItem) => void,
	close: () => void,
};

export const useDepartmentFormDrawer = (): UseDepartmentFormDrawerReturn => {
	const [drawerState, setDrawerState] = useState<DepartmentFormDrawerState>(null);

	const openCreate = () => setDrawerState({ mode: 'create' });

	const openEdit = (department: DepartmentListItem) => setDrawerState({ mode: 'edit', department });

	const close = () => setDrawerState(null);

	return {
		drawerState,
		isOpen: !!drawerState,
		openCreate,
		openEdit,
		close,
	};
};
