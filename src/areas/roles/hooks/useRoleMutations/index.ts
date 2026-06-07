import { useMutation, useQueryClient } from '@tanstack/react-query';

import { executeCreateRole, executeDeleteRole, executeUpdateRole } from '../../service/roleService';
import type { Role } from '../../types';

export type UseRoleMutationsInput = {
	onCreateSuccess?: () => void,
	onCreateError?: (message: string) => void,
	onUpdateSuccess?: () => void,
	onUpdateError?: (message: string) => void,
	onDeleteSuccess?: () => void,
	onDeleteError?: (message: string) => void,
};

export type UseRoleMutationsReturn = {
	createRole: (name: string) => void,
	isCreatingRole: boolean,
	updateRole: (role: Role) => void,
	isUpdatingRole: boolean,
	deleteRole: (roleId: number) => void,
	isDeletingRole: boolean,
};

export const useRoleMutations = ({
	onCreateSuccess,
	onCreateError,
	onUpdateSuccess,
	onUpdateError,
	onDeleteSuccess,
	onDeleteError,
}: UseRoleMutationsInput = {}): UseRoleMutationsReturn => {
	const queryClient = useQueryClient();

	const invalidateAll = () => {
		queryClient.invalidateQueries({ queryKey: ['roles'] });
		// Keep employee filter options in sync so the EmployeeForm selects reflect changes immediately
		queryClient.invalidateQueries({ queryKey: ['employeeFilterOptions'] });
	};

	const { mutate: createRole, isPending: isCreatingRole } = useMutation({
		mutationFn: (name: string) => executeCreateRole(name),
		onSuccess: () => {
			invalidateAll();
			onCreateSuccess?.();
		},
		onError: (error) => {
			onCreateError?.(error.message);
		},
	});

	const { mutate: updateRole, isPending: isUpdatingRole } = useMutation({
		mutationFn: (role: Role) => executeUpdateRole(role),
		onSuccess: () => {
			invalidateAll();
			onUpdateSuccess?.();
		},
		onError: (error) => {
			onUpdateError?.(error.message);
		},
	});

	const { mutate: deleteRole, isPending: isDeletingRole } = useMutation({
		mutationFn: (roleId: number) => executeDeleteRole(roleId),
		onSuccess: () => {
			invalidateAll();
			onDeleteSuccess?.();
		},
		onError: (error) => {
			onDeleteError?.(error.message);
		},
	});

	return {
		createRole,
		isCreatingRole,
		updateRole,
		isUpdatingRole,
		deleteRole,
		isDeletingRole,
	};
};
