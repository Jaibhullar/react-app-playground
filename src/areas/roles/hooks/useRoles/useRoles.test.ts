import { renderHook, waitFor } from '@testing-library/react';

import { wrapper } from '@/test/testUtils';

import { executeGetRoles } from '../../service/roleService';
import type { GetRolesResponse } from '../../types';
import { useRoles } from '.';

vi.mock('../../service/roleService');

const mockExecuteGetRoles = vi.mocked(executeGetRoles);

const mockRolesResponse: GetRolesResponse = {
	roles: [
		{ id: 0, name: 'Software Engineer', assignedEmployeeCount: 8 },
		{ id: 1, name: 'Product Manager', assignedEmployeeCount: 0 },
	],
};

describe('useRoles', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockExecuteGetRoles.mockResolvedValue(mockRolesResponse);
	});

	it('should return loading state initially', () => {
		const { result } = renderHook(() => useRoles(), { wrapper });

		expect(result.current.isLoading).toBe(true);
		expect(result.current.isError).toBe(false);
		expect(result.current.roles).toEqual([]);
	});

	it('should return roles on a successful fetch', async () => {
		const { result } = renderHook(() => useRoles(), { wrapper });

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.isError).toBe(false);
		expect(result.current.roles).toEqual(mockRolesResponse.roles);
	});

	it('should return error state when fetch fails', async () => {
		mockExecuteGetRoles.mockRejectedValue(new Error('Failed to fetch roles: 500'));

		const { result } = renderHook(() => useRoles(), { wrapper });

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.isError).toBe(true);
		expect(result.current.roles).toEqual([]);
	});

	it('should return an empty array when the response contains no roles', async () => {
		mockExecuteGetRoles.mockResolvedValue({ roles: [] });

		const { result } = renderHook(() => useRoles(), { wrapper });

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.roles).toEqual([]);
	});
});
