import { useState } from 'react';

import type { RoleFormDrawerState, RoleListItem } from '../../types';

export type UseRoleFormDrawerReturn = {
	drawerState: RoleFormDrawerState,
	isOpen: boolean,
	openCreate: () => void,
	openEdit: (role: RoleListItem) => void,
	close: () => void,
};

export const useRoleFormDrawer = (): UseRoleFormDrawerReturn => {
	const [drawerState, setDrawerState] = useState<RoleFormDrawerState>(null);

	const openCreate = () => setDrawerState({ mode: 'create' });

	const openEdit = (role: RoleListItem) => setDrawerState({ mode: 'edit', role });

	const close = () => setDrawerState(null);

	return {
		drawerState,
		isOpen: !!drawerState,
		openCreate,
		openEdit,
		close,
	};
};
