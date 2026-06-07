import { useMutation, useQueryClient } from '@tanstack/react-query';

import { executeCreateLocation, executeDeleteLocation, executeUpdateLocation } from '../../service/locationService';
import type { Location } from '../../types';

export type UseLocationMutationsInput = {
	onCreateSuccess?: () => void,
	onCreateError?: (message: string) => void,
	onUpdateSuccess?: () => void,
	onUpdateError?: (message: string) => void,
	onDeleteSuccess?: () => void,
	onDeleteError?: (message: string) => void,
};

export type UseLocationMutationsReturn = {
	createLocation: (name: string) => void,
	isCreatingLocation: boolean,
	updateLocation: (location: Location) => void,
	isUpdatingLocation: boolean,
	deleteLocation: (locationId: number) => void,
	isDeletingLocation: boolean,
};

export const useLocationMutations = ({
	onCreateSuccess,
	onCreateError,
	onUpdateSuccess,
	onUpdateError,
	onDeleteSuccess,
	onDeleteError,
}: UseLocationMutationsInput = {}): UseLocationMutationsReturn => {
	const queryClient = useQueryClient();

	const invalidateAll = () => {
		queryClient.invalidateQueries({ queryKey: ['locations'] });
		// Keep employee filter options in sync so the EmployeeForm selects reflect changes immediately
		queryClient.invalidateQueries({ queryKey: ['employeeFilterOptions'] });
	};

	const { mutate: createLocation, isPending: isCreatingLocation } = useMutation({
		mutationFn: (name: string) => executeCreateLocation(name),
		onSuccess: () => {
			invalidateAll();
			onCreateSuccess?.();
		},
		onError: (error) => {
			onCreateError?.(error.message);
		},
	});

	const { mutate: updateLocation, isPending: isUpdatingLocation } = useMutation({
		mutationFn: (location: Location) => executeUpdateLocation(location),
		onSuccess: () => {
			invalidateAll();
			onUpdateSuccess?.();
		},
		onError: (error) => {
			onUpdateError?.(error.message);
		},
	});

	const { mutate: deleteLocation, isPending: isDeletingLocation } = useMutation({
		mutationFn: (locationId: number) => executeDeleteLocation(locationId),
		onSuccess: () => {
			invalidateAll();
			onDeleteSuccess?.();
		},
		onError: (error) => {
			onDeleteError?.(error.message);
		},
	});

	return {
		createLocation,
		isCreatingLocation,
		updateLocation,
		isUpdatingLocation,
		deleteLocation,
		isDeletingLocation,
	};
};
