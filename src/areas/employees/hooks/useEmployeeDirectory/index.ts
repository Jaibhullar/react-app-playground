import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useDepartments } from '@/areas/settings/hooks/useDepartments';
import { useLocations } from '@/areas/settings/hooks/useLocations';
import { paginateData } from '@/common/utils/paginateData';

import { EMPLOYEES_QUERY_KEY, executeGetEmployees } from '../../service/employeeService';
import type { Employee } from '../../types';

const ALL_VALUE = 'all' as const;
const EMPLOYEES_PER_PAGE = 9;

export type UseEmployeeDirectoryReturn = {
	employees: Employee[],
	totalEmployees: number,
	currentPage: number,
	totalPages: number,
	isLoading: boolean,
	isError: boolean,
	searchQuery: string,
	selectedDepartmentId: string,
	selectedLocationId: string,
	handleSearchChange: (query: string) => void,
	handleDepartmentChange: (departmentId: string) => void,
	handleLocationChange: (locationId: string) => void,
	handlePageChange: (page: number) => void,
	departmentOptions: Array<{
		value: string,
		label: string,
	}>,
	locationOptions: Array<{
		value: string,
		label: string,
	}>,
};

export function useEmployeeDirectory(): UseEmployeeDirectoryReturn {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>(ALL_VALUE);
	const [selectedLocationId, setSelectedLocationId] = useState<string>(ALL_VALUE);
	const [currentPage, setCurrentPage] = useState(1);

	const filters = useMemo(
		() => ({
			departmentId: selectedDepartmentId !== ALL_VALUE ? Number(selectedDepartmentId) : undefined,
			locationId: selectedLocationId !== ALL_VALUE ? Number(selectedLocationId) : undefined,
		}),
		[selectedDepartmentId, selectedLocationId]
	);

	const { data, isLoading, isError } = useQuery({
		queryKey: [...EMPLOYEES_QUERY_KEY, filters],
		queryFn: () => executeGetEmployees({ filters, pagination: { pageSize: 1000 } }),
	});

	const { departments } = useDepartments();
	const { locations } = useLocations();

	const filteredEmployees = useMemo(() => {
		if (!data?.employees) return [];
		if (!searchQuery.trim()) return data.employees;
		const lowerQuery = searchQuery.toLowerCase();
		return data.employees.filter(
			(e) =>
				e.name.toLowerCase().includes(lowerQuery) ||
				e.role.name.toLowerCase().includes(lowerQuery)
		);
	}, [data?.employees, searchQuery]);

	const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / EMPLOYEES_PER_PAGE));

	const employees = useMemo(
		() => paginateData(filteredEmployees, currentPage, EMPLOYEES_PER_PAGE),
		[filteredEmployees, currentPage]
	);

	const departmentOptions = useMemo(
		() => [
			{ value: ALL_VALUE, label: 'All Departments' },
			...departments.map((d) => ({ value: String(d.id), label: d.name })),
		],
		[departments]
	);

	const locationOptions = useMemo(
		() => [
			{ value: ALL_VALUE, label: 'All Locations' },
			...locations.map((l) => ({ value: String(l.id), label: l.name })),
		],
		[locations]
	);

	const handleSearchChange = useCallback((query: string) => {
		setSearchQuery(query);
		setCurrentPage(1);
	}, []);

	const handleDepartmentChange = useCallback((departmentId: string) => {
		setSelectedDepartmentId(departmentId);
		setCurrentPage(1);
	}, []);

	const handleLocationChange = useCallback((locationId: string) => {
		setSelectedLocationId(locationId);
		setCurrentPage(1);
	}, []);

	const handlePageChange = useCallback((page: number) => {
		setCurrentPage(page);
	}, []);

	return {
		employees,
		totalEmployees: filteredEmployees.length,
		currentPage,
		totalPages,
		isLoading,
		isError,
		searchQuery,
		selectedDepartmentId,
		selectedLocationId,
		handleSearchChange,
		handleDepartmentChange,
		handleLocationChange,
		handlePageChange,
		departmentOptions,
		locationOptions,
	};
}
