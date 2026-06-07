import { renderHook, waitFor } from '@testing-library/react';

import { wrapper } from '@/test/testUtils';

import { executeGetDepartments } from '../../service/departmentService';
import type { GetDepartmentsResponse } from '../../types';
import { useDepartments } from '.';

vi.mock('../../service/departmentService');

const mockExecuteGetDepartments = vi.mocked(executeGetDepartments);

const mockDepartmentsResponse: GetDepartmentsResponse = {
	departments: [
		{ id: 0, name: 'Engineering', assignedEmployeeCount: 10 },
		{ id: 1, name: 'Marketing', assignedEmployeeCount: 0 },
	],
};

describe('useDepartments', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockExecuteGetDepartments.mockResolvedValue(mockDepartmentsResponse);
	});

	it('should return loading state initially', () => {
		const { result } = renderHook(() => useDepartments(), { wrapper });

		expect(result.current.isLoading).toBe(true);
		expect(result.current.isError).toBe(false);
		expect(result.current.departments).toEqual([]);
	});

	it('should return departments on a successful fetch', async () => {
		const { result } = renderHook(() => useDepartments(), { wrapper });

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.isError).toBe(false);
		expect(result.current.departments).toEqual(mockDepartmentsResponse.departments);
	});

	it('should return error state when fetch fails', async () => {
		mockExecuteGetDepartments.mockRejectedValue(new Error('Failed to fetch departments: 500'));

		const { result } = renderHook(() => useDepartments(), { wrapper });

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.isError).toBe(true);
		expect(result.current.departments).toEqual([]);
	});

	it('should return an empty array when the response contains no departments', async () => {
		mockExecuteGetDepartments.mockResolvedValue({ departments: [] });

		const { result } = renderHook(() => useDepartments(), { wrapper });

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.departments).toEqual([]);
	});
});
