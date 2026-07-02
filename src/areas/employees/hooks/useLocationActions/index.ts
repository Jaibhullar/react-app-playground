import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { EMPLOYEES_QUERY_KEY } from '../../service/employeeService';
import { executeCreateLocation, executeDeleteLocation, executeUpdateLocation, LOCATION_IN_USE_ERROR, LOCATIONS_QUERY_KEY } from '../../service/locationService';

export type UseLocationActionsInput = {
	onCreateSuccess?: () => void,
	onUpdateSuccess?: () => void,
	onDeleteSuccess?: () => void,
	/** Called when delete fails because the location has assigned employees */
	onDeleteConflict?: () => void,
	onError?: (error: Error) => void,
};

export type UseLocationActionsReturn = {
	handleCreateLocation: (name: string) => void,
	handleUpdateLocation: (locationId: number, name: string) => void,
	handleDeleteLocation: (locationId: number, reassignToId?: number) => void,
	isCreatePending: boolean,
	isUpdatePending: boolean,
	isDeletePending: boolean,
};

export function useLocationActions({
	onCreateSuccess,
	onUpdateSuccess,
	onDeleteSuccess,
	onDeleteConflict,
	onError,
}: UseLocationActionsInput = {}): UseLocationActionsReturn {
	const queryClient = useQueryClient();

	const { mutate: createLocation, isPending: isCreatePending } = useMutation({
		mutationFn: executeCreateLocation,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: LOCATIONS_QUERY_KEY });
			onCreateSuccess?.();
		},
		onError,
	});

	const { mutate: updateLocation, isPending: isUpdatePending } = useMutation({
		mutationFn: executeUpdateLocation,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: LOCATIONS_QUERY_KEY });
			onUpdateSuccess?.();
		},
		onError,
	});

	const { mutate: deleteLocation, isPending: isDeletePending } = useMutation({
		mutationFn: executeDeleteLocation,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: LOCATIONS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
			onDeleteSuccess?.();
		},
		onError: (error: Error) => {
			if (error.message === LOCATION_IN_USE_ERROR) {
				onDeleteConflict?.();
			}
			else {
				onError?.(error);
			}
		},
	});

	const handleCreateLocation = useCallback((name: string) => {
		createLocation({ name });
	}, [createLocation]);

	const handleUpdateLocation = useCallback((locationId: number, name: string) => {
		updateLocation({ locationId, name });
	}, [updateLocation]);

	const handleDeleteLocation = useCallback((locationId: number, reassignToId?: number) => {
		deleteLocation({ locationId, reassignToId });
	}, [deleteLocation]);

	return {
		handleCreateLocation,
		handleUpdateLocation,
		handleDeleteLocation,
		isCreatePending,
		isUpdatePending,
		isDeletePending,
	};
}
