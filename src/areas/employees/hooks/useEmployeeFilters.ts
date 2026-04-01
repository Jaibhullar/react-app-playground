import { useState } from 'react';

import type { EmployeeFilters } from '../types';

export type useEmployeeFiltersReturnType = {
	filters: EmployeeFilters,
	addFilter: (filterName: keyof EmployeeFilters, value: number) => void,
	removeFilter: (filterName: keyof EmployeeFilters) => void,
};

export const useEmployeeFilters = (): useEmployeeFiltersReturnType =>{
	const [filters, setFilters] = useState<EmployeeFilters>({
		departmentIds: 'all',
		locationIds: 'all',
		roleIds: 'all',
	});

	const addFilter = (filterName: keyof EmployeeFilters, value: number) => {
		setFilters(prevFilters => ({
			...prevFilters,
			[filterName]: Array.isArray(prevFilters[filterName]) ? [...prevFilters[filterName], value] : [value],
		}));
	};

	const removeFilter = (filterName: keyof EmployeeFilters) => {
		setFilters(prevFilters => {
			const updatedFilters = { ...prevFilters };
			updatedFilters[filterName] = 'all';
			return updatedFilters;
		});
	};
	return {
		filters,
		addFilter,
		removeFilter,
	};
};