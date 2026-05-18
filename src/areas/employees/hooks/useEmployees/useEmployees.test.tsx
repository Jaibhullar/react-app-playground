import { renderHook, waitFor } from '@testing-library/react';

import { wrapper } from '@/test/testUtils';

import { executeGetEmployees } from '../../service/employeeService';
import type { GetEmployeesResponse } from '../../types';
import { useEmployees } from '.';

vi.mock('../../service/employeeService');

const mockExecuteGetEmployees = vi.mocked(executeGetEmployees);

const mockEmployeesResponse: GetEmployeesResponse = {
	employees: [
		{
			id: 1,
			name: 'Alex Smith',
			department: { id: 1, name: 'Engineering' },
			location: { id: 1, name: 'London' },
			role: { id: 1, name: 'Software Engineer' },
		},
	],
	totalItems: 1,
	currentPage: 1,
	pageSize: 10,
	totalPages: 1,
};

describe('useEmployees', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockExecuteGetEmployees.mockResolvedValue(mockEmployeesResponse);
	});

	it('should return loading state initially', () => {
		const { result } = renderHook(() => useEmployees({}), { wrapper });

		expect(result.current.isLoading).toBe(true);
		expect(result.current.isError).toBe(false);
		expect(result.current.employees).toEqual([]);
	});

	it('should return employees data on successful fetch', async () => {
		const { result } = renderHook(() => useEmployees({}), { wrapper });

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.isError).toBe(false);
		expect(result.current.employees).toEqual(mockEmployeesResponse.employees);
	});

	it('should return error state when fetch fails', async () => {
		mockExecuteGetEmployees.mockRejectedValue(new Error('Failed to fetch employees: 500'));

		const { result } = renderHook(() => useEmployees({}), { wrapper });

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.isError).toBe(true);
		expect(result.current.employees).toEqual([]);
	});

	it('should return pagination metadata with safe defaults while loading', () => {
		const { result } = renderHook(() => useEmployees({}), { wrapper });

		expect(result.current.totalPages).toBe(0);
		expect(result.current.totalItems).toBe(0);
		expect(result.current.currentPage).toBe(1);
		expect(result.current.pageSize).toBe(20);
	});

	it('should return pagination metadata from the response after a successful fetch', async () => {
		const { result } = renderHook(() => useEmployees({}), { wrapper });

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.totalPages).toBe(mockEmployeesResponse.totalPages);
		expect(result.current.totalItems).toBe(mockEmployeesResponse.totalItems);
		expect(result.current.currentPage).toBe(mockEmployeesResponse.currentPage);
		expect(result.current.pageSize).toBe(mockEmployeesResponse.pageSize);
	});

	it('should return an empty employees array when the response contains no employees', async () => {
		mockExecuteGetEmployees.mockResolvedValue({
			employees: [],
			totalItems: 0,
			currentPage: 1,
			pageSize: 10,
			totalPages: 0,
		});

		const { result } = renderHook(() => useEmployees({}), { wrapper });

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.employees).toEqual([]);
		expect(result.current.totalItems).toBe(0);
		expect(result.current.totalPages).toBe(0);
	});

	it('should forward filters and pagination to the service', async () => {
		const { result } = renderHook(
			() => useEmployees({
				filters: { search: 'Alex', departmentIds: [1], locationIds: 'all', roleIds: 'all' },
				pagination: { currentPage: 2, pageSize: 5 },
			}),
			{ wrapper }
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(mockExecuteGetEmployees).toHaveBeenCalledWith({
			filters: { search: 'Alex', departmentIds: [1], locationIds: 'all', roleIds: 'all' },
			pagination: { currentPage: 2, pageSize: 5 },
		});
	});
});