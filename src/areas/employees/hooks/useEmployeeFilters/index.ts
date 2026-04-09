import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { executeGetEmployeeFilters } from '../../service/employeeService';
import type { EmployeeFilters, GetEmployeeFiltersResponse } from '../../types';

type MultiSelectFilterKeys = Exclude<keyof EmployeeFilters, 'search'>;

export type UseEmployeeFiltersReturnType = {
	filters: EmployeeFilters,
	filterOptions: GetEmployeeFiltersResponse | undefined,
	isLoading: boolean,
	isError: boolean,
	addFilter: (filterName: MultiSelectFilterKeys, value: number) => void,
	removeFilter: (filterName: MultiSelectFilterKeys) => void,
	searchEmployee: (value: string) => void,
};

export const useEmployeeFilters = (): UseEmployeeFiltersReturnType =>{
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
		setFilters(prevFilters => ({
			...prevFilters,
			[filterName]: Array.isArray(prevFilters[filterName]) ? [...prevFilters[filterName], value] : [value],
		}));
	};

	const removeFilter = (filterName: MultiSelectFilterKeys) => {
		setFilters(prevFilters => {
			const updatedFilters = { ...prevFilters };
			updatedFilters[filterName] = 'all';
			return updatedFilters;
		});
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