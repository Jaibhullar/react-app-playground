import { useQuery } from '@tanstack/react-query';

import { executeGetRoles } from '../../service/roleService';
import type { RoleListItem } from '../../types';

export type UseRolesReturn = {
	roles: RoleListItem[],
	isLoading: boolean,
	isError: boolean,
};

export const useRoles = (): UseRolesReturn => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['roles'],
		queryFn: executeGetRoles,
	});

	return {
		roles: data?.roles ?? [],
		isLoading,
		isError,
	};
};
