import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { EMPLOYEES_QUERY_KEY, executeGetEmployees } from '../../service/employeeService';
import type { Employee } from '../../types';

const ALL_VALUE = 'all' as const;
const EMPLOYEES_PER_PAGE = 9;

export type UseEmployeeDirectoryInput = {
	searchQuery: string,
	departmentId: string,
	locationId: string,
};

export type UseEmployeeDirectoryReturn = {
	employees: Employee[],
	totalEmployees: number,
	currentPage: number,
	totalPages: number,
	isLoading: boolean,
	isError: boolean,
	handlePageChange: (page: number) => void,
};

export function useEmployeeDirectory({ searchQuery, departmentId, locationId }: UseEmployeeDirectoryInput): UseEmployeeDirectoryReturn {
	const [currentPage, setCurrentPage] = useState(1);

	// Reset to page 1 whenever any filter changes so the user never lands on a page
	// that no longer exists after filtering.
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, departmentId, locationId]);

	const filters = useMemo(
		() => ({
			departmentId: departmentId !== ALL_VALUE ? Number(departmentId) : undefined,
			locationId: locationId !== ALL_VALUE ? Number(locationId) : undefined,
			search: searchQuery.trim() || undefined,
		}),
		[departmentId, locationId, searchQuery]
	);

	const { data, isLoading, isError } = useQuery({
		queryKey: [...EMPLOYEES_QUERY_KEY, filters, currentPage],
		queryFn: () => executeGetEmployees({
			filters,
			pagination: { currentPage, pageSize: EMPLOYEES_PER_PAGE },
		}),
	});

	const handlePageChange = useCallback((page: number) => {
		setCurrentPage(page);
	}, []);

	return {
		employees: data?.employees ?? [],
		totalEmployees: data?.totalItems ?? 0,
		currentPage,
		totalPages: data?.totalPages ?? 1,
		isLoading,
		isError,
		handlePageChange,
	};
}
