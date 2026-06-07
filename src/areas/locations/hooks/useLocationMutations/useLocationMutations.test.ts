import { act, renderHook, waitFor } from '@testing-library/react';

import { wrapper } from '@/test/testUtils';

import { executeCreateLocation, executeDeleteLocation, executeUpdateLocation } from '../../service/locationService';
import type { Location } from '../../types';
import { useLocationMutations } from '.';

vi.mock('../../service/locationService');

const mockExecuteCreateLocation = vi.mocked(executeCreateLocation);
const mockExecuteUpdateLocation = vi.mocked(executeUpdateLocation);
const mockExecuteDeleteLocation = vi.mocked(executeDeleteLocation);

const mockLocation: Location = { id: 1, name: 'San Francisco' };

describe('useLocationMutations', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('createLocation', () => {
		it('should call executeCreateLocation with the correct name', async () => {
			mockExecuteCreateLocation.mockResolvedValue(mockLocation);

			const { result } = renderHook(() => useLocationMutations(), { wrapper });

			await act(async () => {
				result.current.createLocation('San Francisco');
			});

			expect(mockExecuteCreateLocation).toHaveBeenCalledWith('San Francisco');
		});

		it('should set isCreatingLocation to true while pending', async () => {
			mockExecuteCreateLocation.mockImplementation(() => new Promise(() => {}));

			const { result } = renderHook(() => useLocationMutations(), { wrapper });

			act(() => {
				result.current.createLocation('San Francisco');
			});

			await waitFor(() => {
				expect(result.current.isCreatingLocation).toBe(true);
			});
		});

		it('should call onCreateSuccess callback on success', async () => {
			mockExecuteCreateLocation.mockResolvedValue(mockLocation);
			const onCreateSuccess = vi.fn();

			const { result } = renderHook(() => useLocationMutations({ onCreateSuccess }), { wrapper });

			await act(async () => {
				result.current.createLocation('San Francisco');
			});

			expect(onCreateSuccess).toHaveBeenCalledTimes(1);
		});
	});

	describe('updateLocation', () => {
		it('should call executeUpdateLocation with the correct payload', async () => {
			const updatedLocation: Location = { ...mockLocation, name: 'San Francisco Updated' };
			mockExecuteUpdateLocation.mockResolvedValue(updatedLocation);

			const { result } = renderHook(() => useLocationMutations(), { wrapper });

			await act(async () => {
				result.current.updateLocation(updatedLocation);
			});

			expect(mockExecuteUpdateLocation).toHaveBeenCalledWith(updatedLocation);
		});

		it('should call onUpdateSuccess callback on success', async () => {
			mockExecuteUpdateLocation.mockResolvedValue(mockLocation);
			const onUpdateSuccess = vi.fn();

			const { result } = renderHook(() => useLocationMutations({ onUpdateSuccess }), { wrapper });

			await act(async () => {
				result.current.updateLocation(mockLocation);
			});

			expect(onUpdateSuccess).toHaveBeenCalledTimes(1);
		});
	});

	describe('deleteLocation', () => {
		it('should call executeDeleteLocation with the correct id', async () => {
			mockExecuteDeleteLocation.mockResolvedValue(true);

			const { result } = renderHook(() => useLocationMutations(), { wrapper });

			await act(async () => {
				result.current.deleteLocation(mockLocation.id);
			});

			expect(mockExecuteDeleteLocation).toHaveBeenCalledWith(mockLocation.id);
		});

		it('should set isDeletingLocation to true while pending', async () => {
			mockExecuteDeleteLocation.mockImplementation(() => new Promise(() => {}));

			const { result } = renderHook(() => useLocationMutations(), { wrapper });

			act(() => {
				result.current.deleteLocation(mockLocation.id);
			});

			await waitFor(() => {
				expect(result.current.isDeletingLocation).toBe(true);
			});
		});
	});
});
