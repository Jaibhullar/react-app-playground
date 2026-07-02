import { useCallback } from 'react';
import { Briefcase, Plus } from 'lucide-react';

import { useRoleActions } from '@/areas/employees/hooks/useRoleActions';
import type { RoleWithCount } from '@/areas/employees/service/roleService';
import { useRoles } from '@/areas/settings/hooks/useRoles';
import { Button } from '@/common/components/ui/Button';

import { AttributeListItem } from '../AttributeListItem';
import { ReassignAndDeleteModal } from '../ReassignAndDeleteModal';
import { useEditableAttributeCard } from '../useEditableAttributeCard';

import css from './RolesCard.module.scss';

const DUPLICATE_NAME_ERROR = 'A role with this name already exists' as const;

const testIds = {
	card: 'roles-card',
	addInput: 'roles-card-add-input',
	addButton: 'roles-card-add-button',
};

export const RolesCard = () => {
	const { roles, isLoading, isError } = useRoles();

	const card = useEditableAttributeCard({
		items: roles,
		duplicateNameErrorMessage: DUPLICATE_NAME_ERROR,
	});

	const { handleCreateRole, handleUpdateRole, handleDeleteRole, isCreatePending, isUpdatePending, isDeletePending } = useRoleActions({
		onCreateSuccess: card.onAddSuccess,
		onUpdateSuccess: card.onUpdateSuccess,
		onDeleteSuccess: card.onDeleteSuccess,
	});

	const handleAdd = useCallback(() => {
		const payload = card.tryAdd();
		if (payload) handleCreateRole(payload.name);
	}, [card.tryAdd, handleCreateRole]);

	const handleEditConfirm = useCallback(() => {
		const payload = card.tryUpdate();
		if (payload) handleUpdateRole(payload.id, payload.name);
	}, [card.tryUpdate, handleUpdateRole]);

	const handleReassignAndDeleteConfirm = useCallback((newRoleId: number) => {
		if (!card.reassignDeleteState) return;
		handleDeleteRole(card.reassignDeleteState.id, newRoleId);
	}, [card.reassignDeleteState, handleDeleteRole]);

	return (
		<>
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
							value={card.newName}
							onChange={(e) => card.handleNewNameChange(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') handleAdd();
							}}
							data-testid={testIds.addInput}
							aria-label="New role name"
						/>
						{card.newNameError && <p className={css.errorText}>{card.newNameError}</p>}
					</div>
					<Button
						onClick={handleAdd}
						disabled={!card.newName.trim() || isCreatePending}
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
							const activeEdit = card.editingState?.id === role.id ? card.editingState : null;
							return (
								<AttributeListItem
									key={role.id}
									item={role}
									leadingSlot={<Briefcase size={16} aria-hidden="true" />}
									isEditing={activeEdit !== null}
									editValue={activeEdit?.editValue ?? ''}
									editNameError={activeEdit?.nameError ?? undefined}
									onEditValueChange={card.handleEditValueChange}
									onEditStart={card.handleEditStart}
									onEditConfirm={handleEditConfirm}
									onEditCancel={card.handleEditCancel}
									onDelete={handleDeleteRole}
									onReassignAndDelete={card.handleDeleteOrReassignRequest}
									isUpdatePending={isUpdatePending}
									isDeletePending={isDeletePending}
								/>
							);
						})}
					</ul>
				)}
			</div>

			<ReassignAndDeleteModal
				isOpen={card.reassignDeleteState !== null}
				onClose={card.onDeleteSuccess}
				attributeLabel={card.reassignDeleteState?.name ?? ''}
				totalAssignedEmployees={card.reassignDeleteState?.totalEmployees ?? 0}
				replacementOptions={card.replacementOptions}
				onConfirm={handleReassignAndDeleteConfirm}
				isPending={isDeletePending}
			/>
		</>
	);
};

RolesCard.testIds = testIds;
