import { useQuery } from '@tanstack/react-query';

import type { RoleWithCount } from '@/areas/employees/service/roleService';
import { executeGetRoles, ROLES_QUERY_KEY } from '@/areas/employees/service/roleService';

export type UseRolesReturn = {
	roles: RoleWithCount[],
	isLoading: boolean,
	isError: boolean,
};

export function useRoles(): UseRolesReturn {
	const { data, isLoading, isError } = useQuery({
		queryKey: ROLES_QUERY_KEY,
		queryFn: executeGetRoles,
	});

	return {
		roles: data?.roles ?? [],
		isLoading,
		isError,
	};
}
