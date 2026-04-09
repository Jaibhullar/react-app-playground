import { http, HttpResponse } from 'msw';
import { renderHook, waitFor } from '@testing-library/react';

import { API_BASE_URL } from '@/common/constants';
import { mswServer } from '@/test/mswTest';
import { wrapper } from '@/test/testUtils';

import { useEmployeeDetail } from '.';

describe('useEmployeeDetail', () => {
	it('should return loading state initially', ()=>{
		const { result } = renderHook(() => useEmployeeDetail(1), {
			wrapper: wrapper,
		});

		expect(result.current.isLoading).toBe(true);
		expect(result.current.isError).toBe(false);
		expect(result.current.employeeDetailData).toBeUndefined();
	});
	it('should return employee detail data on successful fetch', async()=>{
		const { result } = renderHook(() => useEmployeeDetail(1), {
			wrapper,
		});

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
			expect(result.current.isError).toBe(false);
			expect(result.current.employeeDetailData).toBeDefined();
			expect(result.current.employeeDetailData?.id).toBe(1);
		});

	});
	it('should return error state when fetch fails', async ()=>{
		// Override MSW handler to return error
		mswServer.use(
			http.get(`${API_BASE_URL}/employee/:employeeId`, () => {
				return HttpResponse.json({ error: 'Not found' }, { status: 404 });
			})
		);

		const { result } = renderHook(() => useEmployeeDetail(999), {
			wrapper,
		});

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
			expect(result.current.isError).toBe(true);
			expect(result.current.employeeDetailData).toBeUndefined();
		});
	});
	it('should handle undefined employee data gracefully', async()=>{
		// Override MSW handler to return undefined
		mswServer.use(
			http.get(`${API_BASE_URL}/employee/:employeeId`, () => {
				return HttpResponse.json({ employee: undefined }, { status: 200 });
			})
		);

		const { result } = renderHook(() => useEmployeeDetail(2), {
			wrapper,
		});

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
			expect(result.current.isError).toBe(false);
			expect(result.current.employeeDetailData).toBeUndefined();
		});
	});
});