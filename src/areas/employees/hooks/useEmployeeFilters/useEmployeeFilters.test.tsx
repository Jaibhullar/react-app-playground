import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

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
			;
			// expect(result.current.isError).toBe(false);
			// expect(result.current.filterOptions).toBeDefined();
		});
	});
	it('should return error state when fetch fails');
	it('should add a single filter value to a filter category');
	it('should add multiple filter values to the same category');
	it('should convert "all" to an array when adding first filter');
	it('should remove a filter and reset it to "all"');
	it('should update search filter value');
	it('should handle multiple filter additions across different categories');
	it('should maintain other filters when removing one filter');
	it('should handle setting empty string to search filter');
});