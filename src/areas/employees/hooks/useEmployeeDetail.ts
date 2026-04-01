import { useQuery } from '@tanstack/react-query';

import { executeGetEmployeeDetail } from '../service/employeeService';
import type { EmployeeDetail } from '../types';

export type UseEmployeeDetailReturnType = {
	employeeDetailData: EmployeeDetail | undefined,
	isLoading: boolean,
	isError: boolean,
};

export const useEmployeeDetail = (employeeId:number)=>{
	const { data: employeeDetailData, isLoading, isError } = useQuery({
		queryKey: ['employeeDetail', employeeId],
		queryFn: ()=>executeGetEmployeeDetail({ employeeId }),
	});

	return {
		employeeDetailData: employeeDetailData?.employee,
		isLoading,
		isError,
	};
};