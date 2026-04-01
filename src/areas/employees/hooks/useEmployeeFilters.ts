import { useState } from 'react';

import type { EmployeeFilters } from '../types';

type MultiSelectFilterKeys = Exclude<keyof EmployeeFilters, 'search'>;

export type UseEmployeeFiltersReturnType = {
	filters: EmployeeFilters,
	addFilter: (filterName: MultiSelectFilterKeys, value: number) => void,
	removeFilter: (filterName: MultiSelectFilterKeys) => void,
	setSearchFilter: (value: string) => void,
};

export const useEmployeeFilters = (): UseEmployeeFiltersReturnType =>{
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

	const setSearchFilter = (value: string) => {
		setFilters(prevFilters => ({
			...prevFilters,
			search: value,
		}));
	};

	return {
		filters,
		addFilter,
		removeFilter,
		setSearchFilter,
	};
};