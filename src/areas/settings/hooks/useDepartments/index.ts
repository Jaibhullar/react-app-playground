import { useQuery } from '@tanstack/react-query';

import type { DepartmentWithCount } from '@/areas/employees/service/departmentService';
import { DEPARTMENTS_QUERY_KEY, executeGetDepartments } from '@/areas/employees/service/departmentService';

export type UseDepartmentsReturn = {
	departments: DepartmentWithCount[],
	isLoading: boolean,
	isError: boolean,
};

export function useDepartments(): UseDepartmentsReturn {
	const { data, isLoading, isError } = useQuery({
		queryKey: DEPARTMENTS_QUERY_KEY,
		queryFn: executeGetDepartments,
	});

	return {
		departments: data?.departments ?? [],
		isLoading,
		isError,
	};
}
