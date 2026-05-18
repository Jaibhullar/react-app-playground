import { useMutation, useQueryClient } from '@tanstack/react-query';

import { executeCreateEmployee, executeDeleteEmployee, executeUpdateEmployee } from '../../service/employeeService';
import type { Employee } from '../../types';

export type UseEmployeeMutationsReturn = {
	deleteEmployee: (employeeId: number) => void,
	isDeletingEmployee: boolean,
	createEmployee: (newEmployee: Omit<Employee, 'id'>) => void,
	isCreatingEmployee: boolean,
	updateEmployee: (employee: Employee) => void,
	isUpdatingEmployee: boolean,
};

export const useEmployeeMutations = (): UseEmployeeMutationsReturn => {
	const queryClient = useQueryClient();

	const { mutate: deleteEmployee, isPending: isDeletingEmployee } = useMutation({
		mutationFn: (employeeId: number) => executeDeleteEmployee(employeeId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['employees'] });
		},
	});

	const { mutate: createEmployee, isPending: isCreatingEmployee } = useMutation({
		mutationFn: (newEmployee: Omit<Employee, 'id'>) => executeCreateEmployee(newEmployee),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['employees'] });
		},
	});

	const { mutate: updateEmployee, isPending: isUpdatingEmployee } = useMutation({
		mutationFn: (employee: Employee) => executeUpdateEmployee(employee),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['employees'] });
		},
	});

	return {
		deleteEmployee,
		isDeletingEmployee,
		createEmployee,
		isCreatingEmployee,
		updateEmployee,
		isUpdatingEmployee,
	};
};
