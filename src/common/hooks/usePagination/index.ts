import { useState } from 'react';

export type UsePaginationReturnType = {
	currentPage: number,
	pageSize: number,
	goToPage: (page: number) => void,
	changePageSize: (size: number) => void,
};

export const usePagination = (initialPage: number = 1, initialPageSize: number = 10): UsePaginationReturnType =>{

	const [currentPage, setCurrentPage] = useState<number>(initialPage);
	const [pageSize, setPageSize] = useState<number>(initialPageSize);

	const goToPage = (page: number) => {
		setCurrentPage(page);
	};

	const changePageSize = (size: number) => {
		setPageSize(size);
		setCurrentPage(1); // Reset to first page when page size changes
	};
	return {
		currentPage,
		pageSize,
		goToPage,
		changePageSize,
	};
};