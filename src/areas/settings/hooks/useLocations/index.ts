import { useQuery } from '@tanstack/react-query';

import type { LocationWithCount } from '@/areas/employees/service/locationService';
import { executeGetLocations, LOCATIONS_QUERY_KEY } from '@/areas/employees/service/locationService';

export type UseLocationsReturn = {
	locations: LocationWithCount[],
	isLoading: boolean,
	isError: boolean,
};

export function useLocations(): UseLocationsReturn {
	const { data, isLoading, isError } = useQuery({
		queryKey: LOCATIONS_QUERY_KEY,
		queryFn: executeGetLocations,
	});

	return {
		locations: data?.locations ?? [],
		isLoading,
		isError,
	};
}
