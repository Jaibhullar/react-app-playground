import { act } from 'react';
import { renderHook } from '@testing-library/react';

import { usePagination } from '.';

describe('usePagination', () => {
	it('should initialize with default values when no arguments provided', ()=>{
		const { result } = renderHook(() => usePagination());

		expect(result.current.currentPage).toBe(1);
		expect(result.current.pageSize).toBe(10);
	});
	it('should initialize with custom initial page and page size', ()=>{
		const { result } = renderHook(() => usePagination(2, 20));

		expect(result.current.currentPage).toBe(2);
		expect(result.current.pageSize).toBe(20);
	});
	it('should update current page when goToPage is called', ()=>{
		const { result } = renderHook(() => usePagination());

		expect(result.current.currentPage).toBe(1);
		act(() => {
			result.current.goToPage(3);
		});
		expect(result.current.currentPage).toBe(3);
	});
	it('should update page size when changePageSize is called', ()=>{
		const { result } = renderHook(() => usePagination());

		expect(result.current.pageSize).toBe(10);
		act(() => {
			result.current.changePageSize(25);
		});
		expect(result.current.pageSize).toBe(25);
	});
	it('should reset current page to 1 when page size changes', ()=>{
		const { result } = renderHook(() => usePagination());

		act(() => {
			result.current.goToPage(3);
		});

		expect(result.current.currentPage).toBe(3);

		act(() => {
			result.current.changePageSize(25);
		});
		expect(result.current.currentPage).toBe(1);
	});
	it('should handle multiple page changes correctly', ()=>{
		const { result } = renderHook(() => usePagination());

		expect(result.current.currentPage).toBe(1);

		act(() => {
			result.current.goToPage(2);
		});

		expect(result.current.currentPage).toBe(2);

		act(() => {
			result.current.goToPage(5);
		});

		expect(result.current.currentPage).toBe(5);

		act(() => {
			result.current.goToPage(1);
		});

		expect(result.current.currentPage).toBe(1);
	});
	it('should allow setting the same page size without side effects', ()=>{
		const { result } = renderHook(() => usePagination());

		expect(result.current.pageSize).toBe(10);
		act(() => {
			result.current.changePageSize(10);
		});
		expect(result.current.pageSize).toBe(10);
	});
});