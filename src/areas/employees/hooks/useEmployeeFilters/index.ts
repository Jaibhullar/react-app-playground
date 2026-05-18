import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { executeGetEmployeeFilters } from '../../service/employeeService';
import type { EmployeeFilters, GetEmployeeFiltersResponse } from '../../types';

type MultiSelectFilterKeys = Exclude<keyof EmployeeFilters, 'search'>;

export type UseEmployeeFiltersReturn = {
	filters: EmployeeFilters,
	filterOptions: GetEmployeeFiltersResponse | undefined,
	isLoading: boolean,
	isError: boolean,
	addFilter: (filterName: MultiSelectFilterKeys, value: number) => void,
	removeFilter: (filterName: MultiSelectFilterKeys) => void,
	searchEmployee: (value: string) => void,
};

export const useEmployeeFilters = (): UseEmployeeFiltersReturn => {
	const { data: filterOptions, isLoading, isError } = useQuery({
		queryKey: ['employeeFilterOptions' ],
		queryFn: ()=>executeGetEmployeeFilters(),
	});

	const [filters, setFilters] = useState<EmployeeFilters>({
		search: '',
		departmentIds: 'all',
		locationIds: 'all',
		roleIds: 'all',
	});

	const addFilter = (filterName: MultiSelectFilterKeys, value: number) => {
		setFilters(prevFilters => {
			const current = prevFilters[filterName];
			const currentIds = Array.isArray(current) ? current : [];
			if (currentIds.includes(value)) return prevFilters;
			return { ...prevFilters, [filterName]: [...currentIds, value] };
		});
	};

	const removeFilter = (filterName: MultiSelectFilterKeys) => {
		setFilters(prev => ({ ...prev, [filterName]: 'all' }));
	};

	const searchEmployee = (value: string) => {
		setFilters(prevFilters => ({
			...prevFilters,
			search: value,
		}));
	};

	return {
		filters,
		filterOptions,
		isLoading,
		isError,
		addFilter,
		removeFilter,
		searchEmployee,
	};
};