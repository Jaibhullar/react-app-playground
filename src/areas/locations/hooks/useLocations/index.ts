import { useQuery } from '@tanstack/react-query';

import { executeGetLocations } from '../../service/locationService';
import type { LocationListItem } from '../../types';

export type UseLocationsReturn = {
	locations: LocationListItem[],
	isLoading: boolean,
	isError: boolean,
};

export const useLocations = (): UseLocationsReturn => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['locations'],
		queryFn: executeGetLocations,
	});

	return {
		locations: data?.locations ?? [],
		isLoading,
		isError,
	};
};
