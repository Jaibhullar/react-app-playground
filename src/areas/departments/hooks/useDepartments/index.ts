import { useQuery } from '@tanstack/react-query';

import { executeGetDepartments } from '../../service/departmentService';
import type { DepartmentListItem } from '../../types';

export type UseDepartmentsReturn = {
	departments: DepartmentListItem[],
	isLoading: boolean,
	isError: boolean,
};

export const useDepartments = (): UseDepartmentsReturn => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['departments'],
		queryFn: executeGetDepartments,
	});

	return {
		departments: data?.departments ?? [],
		isLoading,
		isError,
	};
};
