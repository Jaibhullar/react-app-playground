import { useCallback, useMemo, useState } from 'react';

import { useDepartments } from '@/areas/settings/hooks/useDepartments';
import { useLocations } from '@/areas/settings/hooks/useLocations';

const ALL_VALUE = 'all' as const;

export type UseEmployeeDirectoryFiltersReturn = {
	searchQuery: string,
	selectedDepartmentId: string,
	selectedLocationId: string,
	departmentOptions: Array<{
		value: string,
		label: string,
	}>,
	locationOptions: Array<{
		value: string,
		label: string,
	}>,
	handleSearchChange: (query: string) => void,
	handleDepartmentChange: (departmentId: string) => void,
	handleLocationChange: (locationId: string) => void,
};

export function useEmployeeDirectoryFilters(): UseEmployeeDirectoryFiltersReturn {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>(ALL_VALUE);
	const [selectedLocationId, setSelectedLocationId] = useState<string>(ALL_VALUE);

	const { departments } = useDepartments();
	const { locations } = useLocations();

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
	}, []);

	const handleDepartmentChange = useCallback((departmentId: string) => {
		setSelectedDepartmentId(departmentId);
	}, []);

	const handleLocationChange = useCallback((locationId: string) => {
		setSelectedLocationId(locationId);
	}, []);

	return {
		searchQuery,
		selectedDepartmentId,
		selectedLocationId,
		departmentOptions,
		locationOptions,
		handleSearchChange,
		handleDepartmentChange,
		handleLocationChange,
	};
}
