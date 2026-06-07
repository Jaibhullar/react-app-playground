import { useCallback, useState } from 'react';

import { Button } from '@/common/components/ui/Button';

import { useRoleFormDrawer } from './hooks/useRoleFormDrawer';
import { useRoleMutations } from './hooks/useRoleMutations';
import { useRoles } from './hooks/useRoles';
import type { RoleListItem } from './types';

export const RoleSettings = () => {
	const { roles, isLoading, isError } = useRoles();
	const { drawerState, isOpen, openCreate, openEdit, close } = useRoleFormDrawer();

	const [formName, setFormName] = useState('');
	const [confirmEditChecked, setConfirmEditChecked] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);

	const { createRole, isCreatingRole, updateRole, isUpdatingRole, deleteRole, isDeletingRole } = useRoleMutations({
		onCreateSuccess: close,
		onCreateError: setFormError,
		onUpdateSuccess: close,
		onUpdateError: setFormError,
	});

	const isDuplicateName = (() => {
		const trimmed = formName.trim().toLowerCase();
		if (!trimmed) return false;
		return roles.some(r =>
			r.name.toLowerCase() === trimmed &&
			(drawerState?.mode !== 'edit' || r.id !== drawerState.role.id)
		);
	})();

	const isSubmitting = isCreatingRole || isUpdatingRole;
	const isEditingAssigned = drawerState?.mode === 'edit' && drawerState.role.assignedEmployeeCount > 0;
	const canSubmit = !isSubmitting && formName.trim().length > 0 && !isDuplicateName && (!isEditingAssigned || confirmEditChecked);

	const handleOpenCreate = useCallback(() => {
		setFormName('');
		setConfirmEditChecked(false);
		setFormError(null);
		openCreate();
	}, [openCreate]);

	const handleOpenEdit = useCallback((role: RoleListItem) => {
		setFormName(role.name);
		setConfirmEditChecked(false);
		setFormError(null);
		openEdit(role);
	}, [openEdit]);

	const handleSubmit = useCallback(() => {
		if (!drawerState || !formName.trim()) return;

		if (drawerState.mode === 'create') {
			createRole(formName.trim());
		}
		else {
			updateRole({ ...drawerState.role, name: formName.trim() });
		}
	}, [createRole, drawerState, formName, updateRole]);

	if (isLoading) {
		return <p>Loading roles...</p>;
	}

	if (isError) {
		return <p>Error loading roles.</p>;
	}

	return (
		<>
			<h2>Roles</h2>

			<Button onClick={handleOpenCreate}>Add role</Button>

			{roles.length === 0
				? <p>No roles found.</p>
				: (
					<ul>
						{roles.map((role: RoleListItem) => (
							<li key={role.id}>
								{role.name}
								<Button variant="outline" size="sm" onClick={() => handleOpenEdit(role)}>Edit</Button>
								{role.assignedEmployeeCount > 0
									? <span>{role.assignedEmployeeCount} employee(s) assigned — cannot delete</span>
									: <Button variant="destructive" size="sm" onClick={() => deleteRole(role.id)} disabled={isDeletingRole}>Delete</Button>
								}
							</li>
						))}
					</ul>
				)
			}

			{isOpen && drawerState && (
				<div role="dialog" aria-label={drawerState.mode === 'create' ? 'Add role' : 'Edit role'}>
					<input
						type="text"
						placeholder="Role name"
						value={formName}
						onChange={(e) => {
							setFormName(e.target.value); setFormError(null);
						}}
					/>
					{isDuplicateName && (
						<p role="alert">A role with this name already exists.</p>
					)}
					{formError && (
						<p role="alert">{formError}</p>
					)}
					{isEditingAssigned && (
						<>
							<p role="alert">
								Warning: this role is assigned to {drawerState.mode === 'edit' && drawerState.role.assignedEmployeeCount} employee(s). Renaming it will affect all assigned employees.
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
