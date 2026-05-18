import { act, renderHook, waitFor } from '@testing-library/react';

import { wrapper } from '@/test/testUtils';

import { executeCreateEmployee, executeDeleteEmployee, executeUpdateEmployee } from '../../service/employeeService';
import type { Employee } from '../../types';
import { useEmployeeMutations } from '.';

vi.mock('../../service/employeeService');

const mockExecuteDeleteEmployee = vi.mocked(executeDeleteEmployee);
const mockExecuteCreateEmployee = vi.mocked(executeCreateEmployee);
const mockExecuteUpdateEmployee = vi.mocked(executeUpdateEmployee);

const mockEmployee: Employee = {
	id: 1,
	name: 'Alex Smith',
	department: { id: 1, name: 'Engineering' },
	location: { id: 1, name: 'London' },
	role: { id: 1, name: 'Software Engineer' },
};

describe('useEmployeeMutations', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('deleteEmployee', () => {
		it('should call executeDeleteEmployee with the correct employee id', async () => {
			mockExecuteDeleteEmployee.mockResolvedValue(true);

			const { result } = renderHook(() => useEmployeeMutations(), { wrapper });

			await act(async () => {
				result.current.deleteEmployee(mockEmployee.id);
			});

			expect(mockExecuteDeleteEmployee).toHaveBeenCalledWith(mockEmployee.id);
		});

		it('should set isDeletingEmployee to true while the mutation is pending', async () => {
			mockExecuteDeleteEmployee.mockImplementation(() => new Promise(() => {}));

			const { result } = renderHook(() => useEmployeeMutations(), { wrapper });

			act(() => {
				result.current.deleteEmployee(mockEmployee.id);
			});

			await waitFor(() => {
				expect(result.current.isDeletingEmployee).toBe(true);
			});
		});

		it('should set isDeletingEmployee to false after the mutation resolves', async () => {
			mockExecuteDeleteEmployee.mockResolvedValue(true);

			const { result } = renderHook(() => useEmployeeMutations(), { wrapper });

			await act(async () => {
				result.current.deleteEmployee(mockEmployee.id);
			});

			expect(result.current.isDeletingEmployee).toBe(false);
		});
	});

	describe('createEmployee', () => {
		it('should call executeCreateEmployee with the correct payload', async () => {
			mockExecuteCreateEmployee.mockResolvedValue(mockEmployee);

			const { id: _id, ...newEmployee } = mockEmployee;

			const { result } = renderHook(() => useEmployeeMutations(), { wrapper });

			await act(async () => {
				result.current.createEmployee(newEmployee);
			});

			expect(mockExecuteCreateEmployee).toHaveBeenCalledWith(newEmployee);
		});

		it('should set isCreatingEmployee to true while the mutation is pending', async () => {
			mockExecuteCreateEmployee.mockImplementation(() => new Promise(() => {}));

			const { id: _id, ...newEmployee } = mockEmployee;

			const { result } = renderHook(() => useEmployeeMutations(), { wrapper });

			act(() => {
				result.current.createEmployee(newEmployee);
			});

			await waitFor(() => {
				expect(result.current.isCreatingEmployee).toBe(true);
			});
		});

		it('should set isCreatingEmployee to false after the mutation resolves', async () => {
			mockExecuteCreateEmployee.mockResolvedValue(mockEmployee);

			const { id: _id, ...newEmployee } = mockEmployee;

			const { result } = renderHook(() => useEmployeeMutations(), { wrapper });

			await act(async () => {
				result.current.createEmployee(newEmployee);
			});

			expect(result.current.isCreatingEmployee).toBe(false);
		});
	});

	describe('updateEmployee', () => {
		it('should call executeUpdateEmployee with the correct payload', async () => {
			const updatedEmployee: Employee = { ...mockEmployee, name: 'Alex Smith Updated' };
			mockExecuteUpdateEmployee.mockResolvedValue(updatedEmployee);

			const { result } = renderHook(() => useEmployeeMutations(), { wrapper });

			await act(async () => {
				result.current.updateEmployee(updatedEmployee);
			});

			expect(mockExecuteUpdateEmployee).toHaveBeenCalledWith(updatedEmployee);
		});

		it('should set isUpdatingEmployee to true while the mutation is pending', async () => {
			mockExecuteUpdateEmployee.mockImplementation(() => new Promise(() => {}));

			const { result } = renderHook(() => useEmployeeMutations(), { wrapper });

			act(() => {
				result.current.updateEmployee(mockEmployee);
			});

			await waitFor(() => {
				expect(result.current.isUpdatingEmployee).toBe(true);
			});
		});

		it('should set isUpdatingEmployee to false after the mutation resolves', async () => {
			mockExecuteUpdateEmployee.mockResolvedValue(mockEmployee);

			const { result } = renderHook(() => useEmployeeMutations(), { wrapper });

			await act(async () => {
				result.current.updateEmployee(mockEmployee);
			});

			expect(result.current.isUpdatingEmployee).toBe(false);
		});
	});
});
