import { act, renderHook, waitFor } from '@testing-library/react';

import { wrapper } from '@/test/testUtils';

import { executeCreateDepartment, executeDeleteDepartment, executeUpdateDepartment } from '../../service/departmentService';
import type { Department } from '../../types';
import { useDepartmentMutations } from '.';

vi.mock('../../service/departmentService');

const mockExecuteCreateDepartment = vi.mocked(executeCreateDepartment);
const mockExecuteUpdateDepartment = vi.mocked(executeUpdateDepartment);
const mockExecuteDeleteDepartment = vi.mocked(executeDeleteDepartment);

const mockDepartment: Department = { id: 1, name: 'Engineering' };

describe('useDepartmentMutations', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('createDepartment', () => {
		it('should call executeCreateDepartment with the correct name', async () => {
			mockExecuteCreateDepartment.mockResolvedValue(mockDepartment);

			const { result } = renderHook(() => useDepartmentMutations(), { wrapper });

			await act(async () => {
				result.current.createDepartment('Engineering');
			});

			expect(mockExecuteCreateDepartment).toHaveBeenCalledWith('Engineering');
		});

		it('should set isCreatingDepartment to true while pending', async () => {
			mockExecuteCreateDepartment.mockImplementation(() => new Promise(() => {}));

			const { result } = renderHook(() => useDepartmentMutations(), { wrapper });

			act(() => {
				result.current.createDepartment('Engineering');
			});

			await waitFor(() => {
				expect(result.current.isCreatingDepartment).toBe(true);
			});
		});

		it('should call onCreateSuccess callback on success', async () => {
			mockExecuteCreateDepartment.mockResolvedValue(mockDepartment);
			const onCreateSuccess = vi.fn();

			const { result } = renderHook(() => useDepartmentMutations({ onCreateSuccess }), { wrapper });

			await act(async () => {
				result.current.createDepartment('Engineering');
			});

			expect(onCreateSuccess).toHaveBeenCalledTimes(1);
		});
	});

	describe('updateDepartment', () => {
		it('should call executeUpdateDepartment with the correct payload', async () => {
			const updatedDepartment: Department = { ...mockDepartment, name: 'Engineering Updated' };
			mockExecuteUpdateDepartment.mockResolvedValue(updatedDepartment);

			const { result } = renderHook(() => useDepartmentMutations(), { wrapper });

			await act(async () => {
				result.current.updateDepartment(updatedDepartment);
			});

			expect(mockExecuteUpdateDepartment).toHaveBeenCalledWith(updatedDepartment);
		});

		it('should call onUpdateSuccess callback on success', async () => {
			mockExecuteUpdateDepartment.mockResolvedValue(mockDepartment);
			const onUpdateSuccess = vi.fn();

			const { result } = renderHook(() => useDepartmentMutations({ onUpdateSuccess }), { wrapper });

			await act(async () => {
				result.current.updateDepartment(mockDepartment);
			});

			expect(onUpdateSuccess).toHaveBeenCalledTimes(1);
		});
	});

	describe('deleteDepartment', () => {
		it('should call executeDeleteDepartment with the correct id', async () => {
			mockExecuteDeleteDepartment.mockResolvedValue(true);

			const { result } = renderHook(() => useDepartmentMutations(), { wrapper });

			await act(async () => {
				result.current.deleteDepartment(mockDepartment.id);
			});

			expect(mockExecuteDeleteDepartment).toHaveBeenCalledWith(mockDepartment.id);
		});

		it('should set isDeletingDepartment to true while pending', async () => {
			mockExecuteDeleteDepartment.mockImplementation(() => new Promise(() => {}));

			const { result } = renderHook(() => useDepartmentMutations(), { wrapper });

			act(() => {
				result.current.deleteDepartment(mockDepartment.id);
			});

			await waitFor(() => {
				expect(result.current.isDeletingDepartment).toBe(true);
			});
		});
	});
});
