import { useQuery } from '@tanstack/react-query';

import { EMPLOYEE_DETAIL_QUERY_KEY, executeGetEmployeeDetail } from '../../service/employeeService';
import type { EmployeeDetail } from '../../types';

export type UseEmployeeDetailInput = {
	employeeId: number | null,
};

export type UseEmployeeDetailReturn = {
	employeeDetail: EmployeeDetail | undefined,
	isLoading: boolean,
	isError: boolean,
};

export function useEmployeeDetail({ employeeId }: UseEmployeeDetailInput): UseEmployeeDetailReturn {
	const { data, isLoading, isError } = useQuery({
		queryKey: EMPLOYEE_DETAIL_QUERY_KEY(employeeId ?? 0),
		queryFn: () => executeGetEmployeeDetail({ employeeId: employeeId! }),
		enabled: employeeId !== null,
	});

	return {
		employeeDetail: data?.employee,
		isLoading,
		isError,
	};
}
