
import { usePagination } from '@/common/hooks/usePagination';

import { useEmployeeFilters } from './hooks/useEmployeeFilters';
import { useEmployees } from './hooks/useEmployees';

export const EmployeeDirectory = () => {
	const { filters, addFilter, removeFilter } = useEmployeeFilters();
	const { currentPage, pageSize, goToPage, changePageSize } = usePagination();
	const { employees, totalPages, totalItems, isLoading, isError } = useEmployees({ filters, pagination: { currentPage, pageSize } });

	if(isLoading) {
		return <p>Loading...</p>;
	}

	if(isError) {
		return <p>Error loading employees.</p>;
	}

	if(!employees || employees.length === 0) {
		return <p>No employees found.</p>;
	}

	return (
		<>
			<p>Total Pages: {totalPages}</p>
			<p>Total Items: {totalItems}</p>
			<ul>
				{employees.map(employee => (
					<li key={employee.id}>
						{employee.name} - {employee.department.name} - {employee.location.name} - {employee.role.name} - ID: {employee.id}
					</li>
				))}
			</ul>
			{totalPages && (
				<div className='pagination-controls'>
					{Array.from({ length: totalPages }, (_, index) => (
						<button key={index} onClick={() => goToPage(index + 1)} disabled={currentPage === index + 1}>
							{index + 1}
						</button>
					))}
				</div>
			)}
			<div className='page-size-controls'>
				<label htmlFor='pageSize'>Items per page:</label>
				<select id='pageSize' value={pageSize} onChange={(e) => changePageSize(Number(e.target.value))}>
					<option value={5}>5</option>
					<option value={10}>10</option>
					<option value={20}>20</option>
				</select>
			</div>
		</>
	);
};