import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DEPARTMENT_IN_USE_ERROR, DEPARTMENTS_QUERY_KEY, executeCreateDepartment, executeDeleteDepartment, executeUpdateDepartment } from '../../service/departmentService';

export type UseDepartmentActionsInput = {
	onCreateSuccess?: () => void,
	onUpdateSuccess?: () => void,
	onDeleteSuccess?: () => void,
	/** Called when delete fails because the department has assigned employees */
	onDeleteConflict?: () => void,
	onError?: (error: Error) => void,
};

export type UseDepartmentActionsReturn = {
	handleCreateDepartment: (name: string, color?: string) => void,
	handleUpdateDepartment: (departmentId: number, name: string, color?: string) => void,
	handleDeleteDepartment: (departmentId: number) => void,
	isCreatePending: boolean,
	isUpdatePending: boolean,
	isDeletePending: boolean,
};

export function useDepartmentActions({
	onCreateSuccess,
	onUpdateSuccess,
	onDeleteSuccess,
	onDeleteConflict,
	onError,
}: UseDepartmentActionsInput = {}): UseDepartmentActionsReturn {
	const queryClient = useQueryClient();

	const { mutate: createDepartment, isPending: isCreatePending } = useMutation({
		mutationFn: executeCreateDepartment,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY });
			onCreateSuccess?.();
		},
		onError,
	});

	const { mutate: updateDepartment, isPending: isUpdatePending } = useMutation({
		mutationFn: executeUpdateDepartment,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY });
			onUpdateSuccess?.();
		},
		onError,
	});

	const { mutate: deleteDepartment, isPending: isDeletePending } = useMutation({
		mutationFn: executeDeleteDepartment,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY });
			onDeleteSuccess?.();
		},
		onError: (error: Error) => {
			if (error.message === DEPARTMENT_IN_USE_ERROR) {
				onDeleteConflict?.();
			}
			else {
				onError?.(error);
			}
		},
	});

	const handleCreateDepartment = useCallback((name: string, color?: string) => {
		createDepartment({ name, color });
	}, [createDepartment]);

	const handleUpdateDepartment = useCallback((departmentId: number, name: string, color?: string) => {
		updateDepartment({ departmentId, name, color });
	}, [updateDepartment]);

	const handleDeleteDepartment = useCallback((departmentId: number) => {
		deleteDepartment({ departmentId });
	}, [deleteDepartment]);

	return {
		handleCreateDepartment,
		handleUpdateDepartment,
		handleDeleteDepartment,
		isCreatePending,
		isUpdatePending,
		isDeletePending,
	};
}
