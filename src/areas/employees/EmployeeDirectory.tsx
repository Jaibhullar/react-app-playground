import { useCallback } from 'react';

import { usePagination } from '@/common/hooks/usePagination';

import { EmployeeForm } from './components/EmployeeForm';
import { useEmployeeFilters } from './hooks/useEmployeeFilters';
import { useEmployeeFormDrawer } from './hooks/useEmployeeFormDrawer';
import { useEmployeeMutations } from './hooks/useEmployeeMutations';
import { useEmployees } from './hooks/useEmployees';
import type { Employee, EmployeeFormValues } from './types';

export const EmployeeDirectory = () => {
	const { filters, filterOptions } = useEmployeeFilters();
	const { currentPage, pageSize, goToPage, changePageSize } = usePagination();
	const { employees, totalPages, totalItems, isLoading, isError } = useEmployees({ filters, pagination: { currentPage, pageSize } });
	const { drawerState, isOpen, openCreate, openEdit, close } = useEmployeeFormDrawer();
	const { deleteEmployee, isDeletingEmployee, createEmployee, isCreatingEmployee, updateEmployee, isUpdatingEmployee } = useEmployeeMutations({
		onCreateSuccess: close,
		onUpdateSuccess: close,
	});

	const isSubmitting = isCreatingEmployee || isUpdatingEmployee;

	const handleDeleteEmployee = useCallback((employeeId: number) => {
		deleteEmployee(employeeId);
	}, [deleteEmployee]);

	const handleFormSubmit = useCallback((values: EmployeeFormValues) => {
		if (!drawerState) return;

		const department = filterOptions?.departments.find(d => d.id === values.departmentId);
		const location = filterOptions?.locations.find(l => l.id === values.locationId);
		const role = filterOptions?.roles.find(r => r.id === values.roleId);

		if (!department || !location || !role) return;

		if (drawerState.mode === 'create') {
			createEmployee({ name: values.name, department, location, role });
		}
		else {
			updateEmployee({ ...drawerState.employee, name: values.name, department, location, role });
		}
	}, [close, createEmployee, drawerState, filterOptions, updateEmployee]);

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (isError) {
		return <p>Error loading employees.</p>;
	}

	if (employees.length === 0) {
		return (
			<>
				<p>No employees found.</p>
				<button onClick={openCreate}>Add employee</button>
			</>
		);
	}

	return (
		<>
			<p>Total Pages: {totalPages}</p>
			<p>Total Items: {totalItems}</p>

			<button onClick={openCreate}>Add employee</button>

			<ul>
				{employees.map((employee: Employee) => (
					<li key={employee.id}>
						{employee.name} - {employee.department.name} - {employee.location.name} - {employee.role.name} - ID: {employee.id}
						<button onClick={() => openEdit(employee)}>Edit</button>
						<button onClick={() => handleDeleteEmployee(employee.id)} disabled={isDeletingEmployee}>Delete</button>
					</li>
				))}
			</ul>

			{totalPages > 0 && (
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

			{isOpen && filterOptions && drawerState && (
				<div role="dialog" aria-label={drawerState.mode === 'create' ? 'Add employee' : 'Edit employee'}>
					<EmployeeForm
						drawerMode={drawerState.mode}
						employee={drawerState.mode === 'edit' ? drawerState.employee : undefined}
						filterOptions={filterOptions}
						isSubmitting={isSubmitting}
						onSubmit={handleFormSubmit}
						onCancel={close}
					/>
				</div>
			)}
		</>
	);
};