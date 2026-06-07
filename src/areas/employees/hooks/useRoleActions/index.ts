import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { executeCreateRole, executeDeleteRole, executeUpdateRole, ROLE_IN_USE_ERROR, ROLES_QUERY_KEY } from '../../service/roleService';

export type UseRoleActionsInput = {
	onCreateSuccess?: () => void,
	onUpdateSuccess?: () => void,
	onDeleteSuccess?: () => void,
	/** Called when delete fails because the role has assigned employees */
	onDeleteConflict?: () => void,
	onError?: (error: Error) => void,
};

export type UseRoleActionsReturn = {
	handleCreateRole: (name: string) => void,
	handleUpdateRole: (roleId: number, name: string) => void,
	handleDeleteRole: (roleId: number) => void,
	isCreatePending: boolean,
	isUpdatePending: boolean,
	isDeletePending: boolean,
};

export function useRoleActions({
	onCreateSuccess,
	onUpdateSuccess,
	onDeleteSuccess,
	onDeleteConflict,
	onError,
}: UseRoleActionsInput = {}): UseRoleActionsReturn {
	const queryClient = useQueryClient();

	const { mutate: createRole, isPending: isCreatePending } = useMutation({
		mutationFn: executeCreateRole,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
			onCreateSuccess?.();
		},
		onError,
	});

	const { mutate: updateRole, isPending: isUpdatePending } = useMutation({
		mutationFn: executeUpdateRole,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
			onUpdateSuccess?.();
		},
		onError,
	});

	const { mutate: deleteRole, isPending: isDeletePending } = useMutation({
		mutationFn: executeDeleteRole,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
			onDeleteSuccess?.();
		},
		onError: (error: Error) => {
			if (error.message === ROLE_IN_USE_ERROR) {
				onDeleteConflict?.();
			}
			else {
				onError?.(error);
			}
		},
	});

	const handleCreateRole = useCallback((name: string) => {
		createRole({ name });
	}, [createRole]);

	const handleUpdateRole = useCallback((roleId: number, name: string) => {
		updateRole({ roleId, name });
	}, [updateRole]);

	const handleDeleteRole = useCallback((roleId: number) => {
		deleteRole({ roleId });
	}, [deleteRole]);

	return {
		handleCreateRole,
		handleUpdateRole,
		handleDeleteRole,
		isCreatePending,
		isUpdatePending,
		isDeletePending,
	};
}
