import { useQuery } from '@tanstack/react-query';

import { executeGetEmployees, GetEmployeesRequest } from '../service/employeeService';
import type { Employee } from '../types';

export type UseEmployeesReturnType = {
	employees: Employee[] | undefined,
	totalPages: number | undefined,
	totalItems: number | undefined,
	currentPage: number | undefined,
	pageSize: number | undefined,
	isLoading: boolean,
	isError: boolean,
};

export const useEmployees = ({ filters, pagination }:GetEmployeesRequest):UseEmployeesReturnType=>{
	const { data: employeesData, isLoading, isError } = useQuery({
		queryKey: ['employees', filters, pagination],
		queryFn: ()=>executeGetEmployees({ filters, pagination }),
	});

	return {
		employees: employeesData?.employees,
		totalPages: employeesData?.totalPages,
		totalItems: employeesData?.totalItems,
		currentPage: employeesData?.currentPage,
		pageSize: employeesData?.pageSize,
		isLoading,
		isError,
	};
};