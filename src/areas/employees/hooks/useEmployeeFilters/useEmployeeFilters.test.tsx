import { act } from 'react';
import { http, HttpResponse } from 'msw';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { API_BASE_URL } from '@/common/constants';
import { mswServer } from '@/test/mswTest';

import { useEmployeeFilters } from '.';

const wrapper = ({ children }: {
	children: React.ReactNode,
}) => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});

	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
};

describe('useEmployeeFilters', () => {
	it('should initialize with default filter values', ()=>{
		const { result } = renderHook(() => useEmployeeFilters(), {
			wrapper,
		});

		expect(result.current.filters).toEqual({
			departmentIds: 'all',
			locationIds: 'all',
			roleIds: 'all',
			search: '',
		});
	});
	it('should return loading state while fetching filter options', async()=>{
		const { result } = renderHook(() => useEmployeeFilters(), {
			wrapper,
		});

		expect(result.current.isLoading).toBe(true);
		expect(result.current.isError).toBe(false);
		expect(result.current.filterOptions).toBeUndefined();
	});
	it('should return filter options on successful fetch', async()=>{
		const { result } = renderHook(() => useEmployeeFilters(), {
			wrapper,
		});

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
			expect(result.current.isError).toBe(false);
			expect(result.current.filterOptions).toBeDefined();
		});
	});
	it('should return error state when fetch fails', async()=>{
		// Override MSW handler to return error
		mswServer.use(
			http.get(`${API_BASE_URL}/employeeFilters`, () => {
				return HttpResponse.json({ error: 'Not found' }, { status: 404 });
			})
		);

		const { result } = renderHook(() => useEmployeeFilters(), {
			wrapper,
		});

		await waitFor(()=>{
			expect(result.current.isLoading).toBe(false);
			expect(result.current.isError).toBe(true);
			expect(result.current.filterOptions).toBeUndefined();
		});
	});
	it('should add a single filter value to a filter category', ()=>{
		const { result } = renderHook(() => useEmployeeFilters(), {
			wrapper,
		});

		act(() => {
			result.current.addFilter('departmentIds', 1);
		});

		expect(result.current.filters.departmentIds).toEqual([1]);
	});
	it('should add multiple filter values to the same category', ()=>{
		const { result } = renderHook(() => useEmployeeFilters(), {
			wrapper,
		});

		act(() => {
			result.current.addFilter('departmentIds', 1);
			result.current.addFilter('departmentIds', 2);
			result.current.addFilter('departmentIds', 3);
			result.current.addFilter('departmentIds', 4);
		});

		expect(result.current.filters.departmentIds).toEqual([1, 2, 3, 4]);
	});
	it('should remove a filter and reset it to "all"', ()=>{
		const { result } = renderHook(() => useEmployeeFilters(), {
			wrapper,
		});

		expect(result.current.filters.locationIds).toBe('all');

		act(() => {
			result.current.addFilter('locationIds', 5);
		});

		expect(result.current.filters.locationIds).toEqual([5]);

		act(() => {
			result.current.removeFilter('locationIds');
		});

		expect(result.current.filters.locationIds).toBe('all');
	});
	it('should update search filter value', ()=>{
		const { result } = renderHook(() => useEmployeeFilters(), {
			wrapper,
		});

		expect(result.current.filters.search).toBe('');

		act(() => {
			result.current.searchEmployee('John Doe');
		});

		expect(result.current.filters.search).toBe('John Doe');
	});
	it('should handle multiple filter additions across different categories', ()=>{
		const { result } = renderHook(() => useEmployeeFilters(), {
			wrapper,
		});

		act(() => {
			result.current.addFilter('departmentIds', 1);
			result.current.addFilter('locationIds', 5);
			result.current.addFilter('roleIds', 10);
		});

		expect(result.current.filters.departmentIds).toEqual([1]);
		expect(result.current.filters.locationIds).toEqual([5]);
		expect(result.current.filters.roleIds).toEqual([10]);
	});
	it('should maintain other filters when removing one filter', ()=>{
		const { result } = renderHook(() => useEmployeeFilters(), {
			wrapper,
		});


		act(() => {
			result.current.addFilter('departmentIds', 1);
			result.current.addFilter('locationIds', 5);
			result.current.addFilter('roleIds', 10);
		});

		expect(result.current.filters.departmentIds).toEqual([1]);
		expect(result.current.filters.locationIds).toEqual([5]);
		expect(result.current.filters.roleIds).toEqual([10]);

		act(() => {
			result.current.removeFilter('locationIds');
		});

		expect(result.current.filters.departmentIds).toEqual([1]);
		expect(result.current.filters.locationIds).toBe('all');
		expect(result.current.filters.roleIds).toEqual([10]);
	});
	it('should handle setting empty string to search filter', ()=>{
		const { result } = renderHook(() => useEmployeeFilters(), {
			wrapper,
		});

		act(() => {
			result.current.searchEmployee('Jane Smith');
		});

		expect(result.current.filters.search).toBe('Jane Smith');

		act(() => {
			result.current.searchEmployee('');
		});

		expect(result.current.filters.search).toBe('');
	});
});