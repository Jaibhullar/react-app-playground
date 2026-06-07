import { act, renderHook } from '@testing-library/react';

import { useEmployeeFormDrawer } from '.';

const mockEmployee = {
	id: 1,
	name: 'Alex Smith',
	department: { id: 1, name: 'Engineering' },
	location: { id: 1, name: 'London' },
	role: { id: 1, name: 'Software Engineer' },
};

describe('useEmployeeFormDrawer', () => {
	it('should initialise with the drawer closed', () => {
		const { result } = renderHook(() => useEmployeeFormDrawer());

		expect(result.current.drawerState).toBeNull();
		expect(result.current.isOpen).toBe(false);
	});

	describe('openCreate', () => {
		it('should set drawerState to create mode and isOpen to true', () => {
			const { result } = renderHook(() => useEmployeeFormDrawer());

			act(() => {
				result.current.openCreate();
			});

			expect(result.current.drawerState).toEqual({ mode: 'create' });
			expect(result.current.isOpen).toBe(true);
		});
	});

	describe('openEdit', () => {
		it('should set drawerState to edit mode with the given employee and isOpen to true', () => {
			const { result } = renderHook(() => useEmployeeFormDrawer());

			act(() => {
				result.current.openEdit(mockEmployee);
			});

			expect(result.current.drawerState).toEqual({ mode: 'edit', employee: mockEmployee });
			expect(result.current.isOpen).toBe(true);
		});

		it('should update the employee when openEdit is called a second time', () => {
			const secondEmployee = { ...mockEmployee, id: 2, name: 'Jordan Johnson' };
			const { result } = renderHook(() => useEmployeeFormDrawer());

			act(() => {
				result.current.openEdit(mockEmployee);
			});

			act(() => {
				result.current.openEdit(secondEmployee);
			});

			expect(result.current.drawerState).toEqual({ mode: 'edit', employee: secondEmployee });
		});
	});

	describe('close', () => {
		it('should reset drawerState to null and isOpen to false', () => {
			const { result } = renderHook(() => useEmployeeFormDrawer());

			act(() => {
				result.current.openCreate();
			});

			expect(result.current.isOpen).toBe(true);

			act(() => {
				result.current.close();
			});

			expect(result.current.drawerState).toBeNull();
			expect(result.current.isOpen).toBe(false);
		});

		it('should close from edit mode', () => {
			const { result } = renderHook(() => useEmployeeFormDrawer());

			act(() => {
				result.current.openEdit(mockEmployee);
			});

			act(() => {
				result.current.close();
			});

			expect(result.current.drawerState).toBeNull();
			expect(result.current.isOpen).toBe(false);
		});
	});
});
