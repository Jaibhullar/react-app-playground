import { useQuery } from '@tanstack/react-query';

import { executeGetEmployees } from '../../service/employeeService';
import type { Employee, GetEmployeesRequest } from '../../types';

export type UseEmployeesReturn = {
	employees: Employee[],
	totalPages: number,
	totalItems: number,
	currentPage: number,
	pageSize: number,
	isLoading: boolean,
	isError: boolean,
};

export const useEmployees = ({ filters, pagination }: GetEmployeesRequest): UseEmployeesReturn => {
	const { data: employeesData, isLoading, isError } = useQuery({
		queryKey: ['employees', filters, pagination],
		queryFn: () => executeGetEmployees({ filters, pagination }),
	});

	return {
		employees: employeesData?.employees ?? [],
		totalPages: employeesData?.totalPages ?? 0,
		totalItems: employeesData?.totalItems ?? 0,
		currentPage: employeesData?.currentPage ?? 1,
		pageSize: employeesData?.pageSize ?? 20,
		isLoading,
		isError,
	};
};