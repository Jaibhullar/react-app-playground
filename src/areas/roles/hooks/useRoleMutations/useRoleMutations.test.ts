import { act, renderHook, waitFor } from '@testing-library/react';

import { wrapper } from '@/test/testUtils';

import { executeCreateRole, executeDeleteRole, executeUpdateRole } from '../../service/roleService';
import type { Role } from '../../types';
import { useRoleMutations } from '.';

vi.mock('../../service/roleService');

const mockExecuteCreateRole = vi.mocked(executeCreateRole);
const mockExecuteUpdateRole = vi.mocked(executeUpdateRole);
const mockExecuteDeleteRole = vi.mocked(executeDeleteRole);

const mockRole: Role = { id: 1, name: 'Software Engineer' };

describe('useRoleMutations', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('createRole', () => {
		it('should call executeCreateRole with the correct name', async () => {
			mockExecuteCreateRole.mockResolvedValue(mockRole);

			const { result } = renderHook(() => useRoleMutations(), { wrapper });

			await act(async () => {
				result.current.createRole('Software Engineer');
			});

			expect(mockExecuteCreateRole).toHaveBeenCalledWith('Software Engineer');
		});

		it('should set isCreatingRole to true while pending', async () => {
			mockExecuteCreateRole.mockImplementation(() => new Promise(() => {}));

			const { result } = renderHook(() => useRoleMutations(), { wrapper });

			act(() => {
				result.current.createRole('Software Engineer');
			});

			await waitFor(() => {
				expect(result.current.isCreatingRole).toBe(true);
			});
		});

		it('should call onCreateSuccess callback on success', async () => {
			mockExecuteCreateRole.mockResolvedValue(mockRole);
			const onCreateSuccess = vi.fn();

			const { result } = renderHook(() => useRoleMutations({ onCreateSuccess }), { wrapper });

			await act(async () => {
				result.current.createRole('Software Engineer');
			});

			expect(onCreateSuccess).toHaveBeenCalledTimes(1);
		});
	});

	describe('updateRole', () => {
		it('should call executeUpdateRole with the correct payload', async () => {
			const updatedRole: Role = { ...mockRole, name: 'Software Engineer Updated' };
			mockExecuteUpdateRole.mockResolvedValue(updatedRole);

			const { result } = renderHook(() => useRoleMutations(), { wrapper });

			await act(async () => {
				result.current.updateRole(updatedRole);
			});

			expect(mockExecuteUpdateRole).toHaveBeenCalledWith(updatedRole);
		});

		it('should call onUpdateSuccess callback on success', async () => {
			mockExecuteUpdateRole.mockResolvedValue(mockRole);
			const onUpdateSuccess = vi.fn();

			const { result } = renderHook(() => useRoleMutations({ onUpdateSuccess }), { wrapper });

			await act(async () => {
				result.current.updateRole(mockRole);
			});

			expect(onUpdateSuccess).toHaveBeenCalledTimes(1);
		});
	});

	describe('deleteRole', () => {
		it('should call executeDeleteRole with the correct id', async () => {
			mockExecuteDeleteRole.mockResolvedValue(true);

			const { result } = renderHook(() => useRoleMutations(), { wrapper });

			await act(async () => {
				result.current.deleteRole(mockRole.id);
			});

			expect(mockExecuteDeleteRole).toHaveBeenCalledWith(mockRole.id);
		});

		it('should set isDeletingRole to true while pending', async () => {
			mockExecuteDeleteRole.mockImplementation(() => new Promise(() => {}));

			const { result } = renderHook(() => useRoleMutations(), { wrapper });

			act(() => {
				result.current.deleteRole(mockRole.id);
			});

			await waitFor(() => {
				expect(result.current.isDeletingRole).toBe(true);
			});
		});
	});
});
