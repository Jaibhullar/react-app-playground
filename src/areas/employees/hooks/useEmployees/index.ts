import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { executeCreateEmployee, executeDeleteEmployee, executeGetEmployees, executeUpdateEmployee } from '../../service/employeeService';
import type { Employee, GetEmployeesRequest } from '../../types';

export type UseEmployeesReturnType = {
	employees: Employee[] | undefined,
	totalPages: number | undefined,
	totalItems: number | undefined,
	currentPage: number | undefined,
	pageSize: number | undefined,
	isLoading: boolean,
	isError: boolean,
	deleteEmployee: (employeeId:number) => void,
	isDeletingEmployee: boolean,
	createEmployee: (newEmployee: Omit<Employee, 'id'>) => void,
	isCreatingEmployee: boolean,
	updateEmployee: (employee: Employee) => void,
	isUpdatingEmployee: boolean,
};

export const useEmployees = ({ filters, pagination }:GetEmployeesRequest):UseEmployeesReturnType=>{
	const queryClient = useQueryClient();

	const { data: employeesData, isLoading, isError } = useQuery({
		queryKey: ['employees', filters, pagination],
		queryFn: ()=>executeGetEmployees({ filters, pagination }),
	});

	const { mutate: deleteEmployee, isPending: isDeletingEmployee } = useMutation({
		mutationFn: (employeeId:number)=>executeDeleteEmployee(employeeId),
		onSuccess: ()=>{
			// Invalidate and refetch employees after a successful deletion
			queryClient.invalidateQueries({ queryKey: ['employees'] });
		},
	});

	const { mutate: createEmployee, isPending: isCreatingEmployee } = useMutation({
		mutationFn: (newEmployee: Omit<Employee, 'id'>) => executeCreateEmployee(newEmployee),
		onSuccess: ()=>{
			queryClient.invalidateQueries({ queryKey: ['employees'] });
		},
	});

	const { mutate: updateEmployee, isPending: isUpdatingEmployee } = useMutation({
		mutationFn: (employee: Employee) => executeUpdateEmployee(employee),
		onSuccess: ()=>{
			queryClient.invalidateQueries({ queryKey: ['employees'] });
		},
	});

	return {
		employees: employeesData?.employees,
		totalPages: employeesData?.totalPages,
		totalItems: employeesData?.totalItems,
		currentPage: employeesData?.currentPage,
		pageSize: employeesData?.pageSize,
		isLoading,
		isError,

		deleteEmployee,
		isDeletingEmployee,

		createEmployee,
		isCreatingEmployee,

		updateEmployee,
		isUpdatingEmployee,
	};
};