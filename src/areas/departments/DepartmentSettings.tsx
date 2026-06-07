import { useCallback, useState } from 'react';

import { Button } from '@/common/components/ui/Button';

import { useDepartmentFormDrawer } from './hooks/useDepartmentFormDrawer';
import { useDepartmentMutations } from './hooks/useDepartmentMutations';
import { useDepartments } from './hooks/useDepartments';
import type { DepartmentListItem } from './types';

export const DepartmentSettings = () => {
	const { departments, isLoading, isError } = useDepartments();
	const { drawerState, isOpen, openCreate, openEdit, close } = useDepartmentFormDrawer();

	const [formName, setFormName] = useState('');
	const [confirmEditChecked, setConfirmEditChecked] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);

	const { createDepartment, isCreatingDepartment, updateDepartment, isUpdatingDepartment, deleteDepartment, isDeletingDepartment } = useDepartmentMutations({
		onCreateSuccess: close,
		onCreateError: setFormError,
		onUpdateSuccess: close,
		onUpdateError: setFormError,
	});

	const isDuplicateName = (() => {
		const trimmed = formName.trim().toLowerCase();
		if (!trimmed) return false;
		return departments.some(d =>
			d.name.toLowerCase() === trimmed &&
			(drawerState?.mode !== 'edit' || d.id !== drawerState.department.id)
		);
	})();

	const isSubmitting = isCreatingDepartment || isUpdatingDepartment;
	const isEditingAssigned = drawerState?.mode === 'edit' && drawerState.department.assignedEmployeeCount > 0;
	const canSubmit = !isSubmitting && formName.trim().length > 0 && !isDuplicateName && (!isEditingAssigned || confirmEditChecked);

	const handleOpenCreate = useCallback(() => {
		setFormName('');
		setConfirmEditChecked(false);
		setFormError(null);
		openCreate();
	}, [openCreate]);

	const handleOpenEdit = useCallback((department: DepartmentListItem) => {
		setFormName(department.name);
		setConfirmEditChecked(false);
		setFormError(null);
		openEdit(department);
	}, [openEdit]);

	const handleSubmit = useCallback(() => {
		if (!drawerState || !formName.trim()) return;

		if (drawerState.mode === 'create') {
			createDepartment(formName.trim());
		}
		else {
			updateDepartment({ ...drawerState.department, name: formName.trim() });
		}
	}, [createDepartment, drawerState, formName, updateDepartment]);

	if (isLoading) {
		return <p>Loading departments...</p>;
	}

	if (isError) {
		return <p>Error loading departments.</p>;
	}

	return (
		<>
			<h2>Departments</h2>

			<Button onClick={handleOpenCreate}>Add department</Button>

			{departments.length === 0
				? <p>No departments found.</p>
				: (
					<ul>
						{departments.map((department: DepartmentListItem) => (
							<li key={department.id}>
								{department.name}
								<Button variant="outline" size="sm" onClick={() => handleOpenEdit(department)}>Edit</Button>
								{department.assignedEmployeeCount > 0
									? <span>{department.assignedEmployeeCount} employee(s) assigned — cannot delete</span>
									: <Button variant="destructive" size="sm" onClick={() => deleteDepartment(department.id)} disabled={isDeletingDepartment}>Delete</Button>
								}
							</li>
						))}
					</ul>
				)
			}

			{isOpen && drawerState && (
				<div role="dialog" aria-label={drawerState.mode === 'create' ? 'Add department' : 'Edit department'}>
					<input
						type="text"
						placeholder="Department name"
						value={formName}
						onChange={(e) => {
							setFormName(e.target.value); setFormError(null);
						}}
					/>
					{isDuplicateName && (
						<p role="alert">A department with this name already exists.</p>
					)}
					{formError && (
						<p role="alert">{formError}</p>
					)}
					{isEditingAssigned && (
						<>
							<p role="alert">
								Warning: this department is assigned to {drawerState.mode === 'edit' && drawerState.department.assignedEmployeeCount} employee(s). Renaming it will affect all assigned employees.
							</p>
							<label>
								<input
									type="checkbox"
									checked={confirmEditChecked}
									onChange={(e) => setConfirmEditChecked(e.target.checked)}
								/>
								I understand this change will affect all assigned employees
							</label>
						</>
					)}
					<Button onClick={handleSubmit} disabled={!canSubmit}>
						{drawerState.mode === 'create' ? 'Create' : 'Save'}
					</Button>
					<Button variant="outline" onClick={close}>Cancel</Button>
				</div>
			)}
		</>
	);
};
