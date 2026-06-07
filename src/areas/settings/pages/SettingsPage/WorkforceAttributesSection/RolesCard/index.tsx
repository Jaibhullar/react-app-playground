import { useCallback, useState } from 'react';
import { Briefcase, Plus } from 'lucide-react';

import { useRoleActions } from '@/areas/employees/hooks/useRoleActions';
import type { RoleWithCount } from '@/areas/employees/service/roleService';
import { useRoles } from '@/areas/settings/hooks/useRoles';
import { Button } from '@/common/components/ui/Button';

import { RoleListItem } from './RoleListItem';

import css from './RolesCard.module.scss';

const DUPLICATE_NAME_ERROR = 'A role with this name already exists' as const;

type EditingState = {
	roleId: number,
	editValue: string,
	nameError: string | null,
} | null;

function isDuplicateName(name: string, roles: RoleWithCount[], excludeId?: number): boolean {
	const normalised = name.trim().toLowerCase();
	return roles.some(r => r.name.toLowerCase() === normalised && r.id !== excludeId);
}

const testIds = {
	card: 'roles-card',
	addInput: 'roles-card-add-input',
	addButton: 'roles-card-add-button',
};

export const RolesCard = () => {
	const { roles, isLoading, isError } = useRoles();

	const [newRoleName, setNewRoleName] = useState('');
	const [newRoleNameError, setNewRoleNameError] = useState<string | null>(null);
	const [editingState, setEditingState] = useState<EditingState>(null);

	const { handleCreateRole, handleUpdateRole, handleDeleteRole, isCreatePending, isUpdatePending, isDeletePending } = useRoleActions({
		onCreateSuccess: () => setNewRoleName(''),
		onUpdateSuccess: () => setEditingState(null),
	});

	const handleAdd = useCallback(() => {
		const trimmedName = newRoleName.trim();
		if (!trimmedName) return;
		if (isDuplicateName(trimmedName, roles)) {
			setNewRoleNameError(DUPLICATE_NAME_ERROR);
			return;
		}
		setNewRoleNameError(null);
		handleCreateRole(trimmedName);
	}, [newRoleName, roles, handleCreateRole]);

	const handleNewNameChange = useCallback((value: string) => {
		setNewRoleName(value);
		if (newRoleNameError) setNewRoleNameError(null);
	}, [newRoleNameError]);

	const handleEditStart = useCallback((roleId: number) => {
		const role = roles.find((r: RoleWithCount) => r.id === roleId);
		if (!role) return;
		setEditingState({ roleId, editValue: role.name, nameError: null });
	}, [roles]);

	const handleEditValueChange = useCallback((value: string) => {
		setEditingState((prev) => {
			if (!prev) return null;
			return { ...prev, editValue: value, nameError: null };
		});
	}, []);

	const handleEditConfirm = useCallback(() => {
		if (!editingState) return;
		const trimmedName = editingState.editValue.trim();
		if (!trimmedName) return;
		if (isDuplicateName(trimmedName, roles, editingState.roleId)) {
			setEditingState((prev) => prev ? { ...prev, nameError: DUPLICATE_NAME_ERROR } : null);
			return;
		}
		handleUpdateRole(editingState.roleId, trimmedName);
	}, [editingState, roles, handleUpdateRole]);

	const handleEditCancel = useCallback(() => {
		setEditingState(null);
	}, []);

	const handleDelete = useCallback((roleId: number) => {
		handleDeleteRole(roleId);
	}, [handleDeleteRole]);

	return (
		<div data-testid={testIds.card}>
			<div className={css.header}>
				<div className={css.headerIcon}>
					<Briefcase size={20} aria-hidden="true" />
				</div>
				<div>
					<h3 className={css.title}>Roles</h3>
					<p className={css.subtitle}>Job roles and positions</p>
				</div>
			</div>

			<div className={css.addRow}>
				<div className={css.addInputWrapper}>
					<input
						className={css.addInput}
						placeholder="New role name"
						value={newRoleName}
						onChange={(e) => handleNewNameChange(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') handleAdd();
						}}
						data-testid={testIds.addInput}
						aria-label="New role name"
					/>
					{newRoleNameError && <p className={css.errorText}>{newRoleNameError}</p>}
				</div>
				<Button
					onClick={handleAdd}
					disabled={!newRoleName.trim() || isCreatePending}
					data-testid={testIds.addButton}
					className={css.addButton}
				>
					<Plus />
					Add
				</Button>
			</div>

			{isLoading && <p className={css.stateMessage}>Loading roles…</p>}
			{isError && <p className={css.stateMessage}>Failed to load roles.</p>}

			{!isLoading && !isError && (
				<ul className={css.list} role="list">
					{roles.map((role: RoleWithCount) => {
						const activeEdit = editingState?.roleId === role.id ? editingState : null;
						return (
							<RoleListItem
								key={role.id}
								role={role}
								isEditing={activeEdit !== null}
								editValue={activeEdit?.editValue ?? ''}
								editNameError={activeEdit?.nameError ?? undefined}
								onEditValueChange={handleEditValueChange}
								onEditStart={handleEditStart}
								onEditConfirm={handleEditConfirm}
								onEditCancel={handleEditCancel}
								onDelete={handleDelete}
								isUpdatePending={isUpdatePending}
								isDeletePending={isDeletePending}
							/>
						);
					})}
				</ul>
			)}
		</div>
	);
};

RolesCard.testIds = testIds;
