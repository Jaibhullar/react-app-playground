import { http, HttpResponse } from 'msw';
import { renderHook, waitFor } from '@testing-library/react';

import { API_BASE_URL } from '@/common/constants';
import { mswServer } from '@/test/mswTest';
import { wrapper } from '@/test/testUtils';

import { useEmployees } from '.';


describe('useEmployees', () => {
	it('should return loading state initially', ()=>{
		const { result } = renderHook(() => useEmployees({}), {
			wrapper: wrapper,
		});

		expect(result.current.isLoading).toBe(true);
		expect(result.current.isError).toBe(false);
		expect(result.current.employees).toBeUndefined();
	});
	it('should return employees data on successful fetch', async()=>{
		const { result } = renderHook(() => useEmployees({}), {
			wrapper,
		});

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
			expect(result.current.isError).toBe(false);
			expect(result.current.employees).toBeDefined();
		});
	});
	it('should return error state when fetch fails', async()=>{
		// Override MSW handler to return error
		mswServer.use(
			http.get(`${API_BASE_URL}/employees`, () => {
				return HttpResponse.json({ error: 'Not found' }, { status: 404 });
			})
		);

		const { result } = renderHook(() => useEmployees({}), { wrapper });

		await waitFor(()=>{
			expect(result.current.isLoading).toBe(false);
			expect(result.current.isError).toBe(true);
			expect(result.current.employees).toBeUndefined();
		});
	});
	it('should return pagination metadata (totalPages, totalItems, currentPage, pageSize)', async()=>{
		const { result } = renderHook(() => useEmployees({}), {
			wrapper,
		});

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
			expect(result.current.isError).toBe(false);
			expect(result.current.totalPages).toBeDefined();
			expect(result.current.totalItems).toBeDefined();
			expect(result.current.currentPage).toBeDefined();
			expect(result.current.pageSize).toBeDefined();
		});
	});
	it('should handle empty employees array', async()=>{
		// Override MSW handler to return empty employees array
		mswServer.use(
			http.get(`${API_BASE_URL}/employees`, () => {
				return HttpResponse.json({
					employees: [],
					totalItems: 0,
					currentPage: 1,
					pageSize: 10,
					totalPages: 0,
				}, { status: 200 });
			})
		);

		const { result } = renderHook(() => useEmployees({}), {
			wrapper,
		});

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
			expect(result.current.isError).toBe(false);
			expect(result.current.employees).toEqual([]);
			expect(result.current.totalItems).toBe(0);
			expect(result.current.totalPages).toBe(0);
		});
	});
	it('should handle undefined employees data gracefully', async()=>{
		// Override MSW handler to return undefined employees
		mswServer.use(
			http.get(`${API_BASE_URL}/employees`, () => {
				return HttpResponse.json({
					employees: undefined,
					totalItems: 0,
					currentPage: 1,
					pageSize: 10,
					totalPages: 0,
				}, { status: 200 });
			})
		);

		const { result } = renderHook(() => useEmployees({}), {
			wrapper,
		});

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
			expect(result.current.isError).toBe(false);
			expect(result.current.employees).toBeUndefined();
		});
	});
});