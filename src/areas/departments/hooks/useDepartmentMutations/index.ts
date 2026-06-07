import { useMutation, useQueryClient } from '@tanstack/react-query';

import { executeCreateDepartment, executeDeleteDepartment, executeUpdateDepartment } from '../../service/departmentService';
import type { Department } from '../../types';

export type UseDepartmentMutationsInput = {
	onCreateSuccess?: () => void,
	onCreateError?: (message: string) => void,
	onUpdateSuccess?: () => void,
	onUpdateError?: (message: string) => void,
	onDeleteSuccess?: () => void,
	onDeleteError?: (message: string) => void,
};

export type UseDepartmentMutationsReturn = {
	createDepartment: (name: string) => void,
	isCreatingDepartment: boolean,
	updateDepartment: (department: Department) => void,
	isUpdatingDepartment: boolean,
	deleteDepartment: (departmentId: number) => void,
	isDeletingDepartment: boolean,
};

export const useDepartmentMutations = ({
	onCreateSuccess,
	onCreateError,
	onUpdateSuccess,
	onUpdateError,
	onDeleteSuccess,
	onDeleteError,
}: UseDepartmentMutationsInput = {}): UseDepartmentMutationsReturn => {
	const queryClient = useQueryClient();

	const invalidateAll = () => {
		queryClient.invalidateQueries({ queryKey: ['departments'] });
		// Keep employee filter options in sync so the EmployeeForm selects reflect changes immediately
		queryClient.invalidateQueries({ queryKey: ['employeeFilterOptions'] });
	};

	const { mutate: createDepartment, isPending: isCreatingDepartment } = useMutation({
		mutationFn: (name: string) => executeCreateDepartment(name),
		onSuccess: () => {
			invalidateAll();
			onCreateSuccess?.();
		},
		onError: (error) => {
			onCreateError?.(error.message);
		},
	});

	const { mutate: updateDepartment, isPending: isUpdatingDepartment } = useMutation({
		mutationFn: (department: Department) => executeUpdateDepartment(department),
		onSuccess: () => {
			invalidateAll();
			onUpdateSuccess?.();
		},
		onError: (error) => {
			onUpdateError?.(error.message);
		},
	});

	const { mutate: deleteDepartment, isPending: isDeletingDepartment } = useMutation({
		mutationFn: (departmentId: number) => executeDeleteDepartment(departmentId),
		onSuccess: () => {
			invalidateAll();
			onDeleteSuccess?.();
		},
		onError: (error) => {
			onDeleteError?.(error.message);
		},
	});

	return {
		createDepartment,
		isCreatingDepartment,
		updateDepartment,
		isUpdatingDepartment,
		deleteDepartment,
		isDeletingDepartment,
	};
};
