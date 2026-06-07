import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { EMPLOYEE_DETAIL_QUERY_KEY,
	EMPLOYEES_QUERY_KEY,
	executeCreateEmployee,
	executeDeleteEmployee,
	executeUpdateEmployee } from '../../service/employeeService';
import type { EmployeeFormValues } from '../../types';


export type UseEmployeeActionsInput = {
	onCreateSuccess?: () => void,
	onUpdateSuccess?: () => void,
	onDeleteSuccess?: () => void,
	onError?: (error: Error) => void,
};

export type UseEmployeeActionsReturn = {
	handleCreateEmployee: (values: EmployeeFormValues) => void,
	handleUpdateEmployee: (employeeId: number, values: EmployeeFormValues) => void,
	handleDeleteEmployee: (employeeId: number) => void,
	isCreatePending: boolean,
	isUpdatePending: boolean,
	isDeletePending: boolean,
};

export function useEmployeeActions({
	onCreateSuccess,
	onUpdateSuccess,
	onDeleteSuccess,
	onError,
}: UseEmployeeActionsInput = {}): UseEmployeeActionsReturn {
	const queryClient = useQueryClient();

	const { mutate: createEmployee, isPending: isCreatePending } = useMutation({
		mutationFn: executeCreateEmployee,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
			onCreateSuccess?.();
		},
		onError,
	});

	const { mutate: updateEmployee, isPending: isUpdatePending } = useMutation({
		mutationFn: executeUpdateEmployee,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: EMPLOYEE_DETAIL_QUERY_KEY(variables.employeeId) });
			onUpdateSuccess?.();
		},
		onError,
	});

	const { mutate: deleteEmployee, isPending: isDeletePending } = useMutation({
		mutationFn: executeDeleteEmployee,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: EMPLOYEE_DETAIL_QUERY_KEY(variables.employeeId) });
			onDeleteSuccess?.();
		},
		onError,
	});

	const handleCreateEmployee = useCallback((values: EmployeeFormValues) => {
		createEmployee(values);
	}, [createEmployee]);

	const handleUpdateEmployee = useCallback((employeeId: number, values: EmployeeFormValues) => {
		updateEmployee({ employeeId, ...values });
	}, [updateEmployee]);

	const handleDeleteEmployee = useCallback((employeeId: number) => {
		deleteEmployee({ employeeId });
	}, [deleteEmployee]);

	return {
		handleCreateEmployee,
		handleUpdateEmployee,
		handleDeleteEmployee,
		isCreatePending,
		isUpdatePending,
		isDeletePending,
	};
}
