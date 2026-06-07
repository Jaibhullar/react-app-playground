import { useState } from 'react';

import type { LocationFormDrawerState, LocationListItem } from '../../types';

export type UseLocationFormDrawerReturn = {
	drawerState: LocationFormDrawerState,
	isOpen: boolean,
	openCreate: () => void,
	openEdit: (location: LocationListItem) => void,
	close: () => void,
};

export const useLocationFormDrawer = (): UseLocationFormDrawerReturn => {
	const [drawerState, setDrawerState] = useState<LocationFormDrawerState>(null);

	const openCreate = () => setDrawerState({ mode: 'create' });

	const openEdit = (location: LocationListItem) => setDrawerState({ mode: 'edit', location });

	const close = () => setDrawerState(null);

	return {
		drawerState,
		isOpen: !!drawerState,
		openCreate,
		openEdit,
		close,
	};
};
