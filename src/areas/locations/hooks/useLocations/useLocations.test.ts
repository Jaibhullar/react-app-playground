import { renderHook, waitFor } from '@testing-library/react';

import { wrapper } from '@/test/testUtils';

import { executeGetLocations } from '../../service/locationService';
import type { GetLocationsResponse } from '../../types';
import { useLocations } from '.';

vi.mock('../../service/locationService');

const mockExecuteGetLocations = vi.mocked(executeGetLocations);

const mockLocationsResponse: GetLocationsResponse = {
	locations: [
		{ id: 0, name: 'San Francisco', assignedEmployeeCount: 15 },
		{ id: 1, name: 'New York', assignedEmployeeCount: 0 },
	],
};

describe('useLocations', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockExecuteGetLocations.mockResolvedValue(mockLocationsResponse);
	});

	it('should return loading state initially', () => {
		const { result } = renderHook(() => useLocations(), { wrapper });

		expect(result.current.isLoading).toBe(true);
		expect(result.current.isError).toBe(false);
		expect(result.current.locations).toEqual([]);
	});

	it('should return locations on a successful fetch', async () => {
		const { result } = renderHook(() => useLocations(), { wrapper });

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.isError).toBe(false);
		expect(result.current.locations).toEqual(mockLocationsResponse.locations);
	});

	it('should return error state when fetch fails', async () => {
		mockExecuteGetLocations.mockRejectedValue(new Error('Failed to fetch locations: 500'));

		const { result } = renderHook(() => useLocations(), { wrapper });

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.isError).toBe(true);
		expect(result.current.locations).toEqual([]);
	});

	it('should return an empty array when the response contains no locations', async () => {
		mockExecuteGetLocations.mockResolvedValue({ locations: [] });

		const { result } = renderHook(() => useLocations(), { wrapper });

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.locations).toEqual([]);
	});
});
