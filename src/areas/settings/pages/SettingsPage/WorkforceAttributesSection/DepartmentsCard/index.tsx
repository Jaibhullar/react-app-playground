import { useCallback } from 'react';
import { Building2, Plus } from 'lucide-react';

import { useDepartmentActions } from '@/areas/employees/hooks/useDepartmentActions';
import type { DepartmentWithCount } from '@/areas/employees/service/departmentService';
import { useDepartments } from '@/areas/settings/hooks/useDepartments';
import { Button } from '@/common/components/ui/Button';

import { AttributeListItem } from '../AttributeListItem';
import { ReassignAndDeleteModal } from '../ReassignAndDeleteModal';
import { useEditableAttributeCard } from '../useEditableAttributeCard';

import css from './DepartmentsCard.module.scss';

const DUPLICATE_NAME_ERROR = 'A department with this name already exists' as const;
const DEFAULT_DEPARTMENT_COLOR = '#6366f1' as const;

const testIds = {
	card: 'departments-card',
	addInput: 'departments-card-add-input',
	addButton: 'departments-card-add-button',
};

export const DepartmentsCard = () => {
	const { departments, isLoading, isError } = useDepartments();

	const card = useEditableAttributeCard({
		items: departments,
		duplicateNameErrorMessage: DUPLICATE_NAME_ERROR,
		defaultColor: DEFAULT_DEPARTMENT_COLOR,
	});

	const { handleCreateDepartment, handleUpdateDepartment, handleDeleteDepartment, isCreatePending, isUpdatePending, isDeletePending } = useDepartmentActions({
		onCreateSuccess: card.onAddSuccess,
		onUpdateSuccess: card.onUpdateSuccess,
		onDeleteSuccess: card.onDeleteSuccess,
	});

	const handleAdd = useCallback(() => {
		const payload = card.tryAdd();
		if (payload) handleCreateDepartment(payload.name, payload.color);
	}, [card.tryAdd, handleCreateDepartment]);

	const handleEditConfirm = useCallback(() => {
		const payload = card.tryUpdate();
		if (payload) handleUpdateDepartment(payload.id, payload.name, payload.color);
	}, [card.tryUpdate, handleUpdateDepartment]);

	const handleReassignAndDeleteConfirm = useCallback((newDepartmentId: number) => {
		if (!card.reassignDeleteState) return;
		handleDeleteDepartment(card.reassignDeleteState.id, newDepartmentId);
	}, [card.reassignDeleteState, handleDeleteDepartment]);

	return (
		<>
			<div data-testid={testIds.card}>
				<div className={css.header}>
					<div className={css.headerIcon}>
						<Building2 size={20} aria-hidden="true" />
					</div>
					<div>
						<h3 className={css.title}>Departments</h3>
						<p className={css.subtitle}>Organizational departments</p>
					</div>
				</div>

				<div className={css.addRow}>
					<input
						type="color"
						className={css.colorInput}
						value={card.newColor}
						onChange={(e) => card.handleNewColorChange(e.target.value)}
						aria-label="New department colour"
					/>
					<div className={css.addInputWrapper}>
						<input
							className={css.addInput}
							placeholder="New department name"
							value={card.newName}
							onChange={(e) => card.handleNewNameChange(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') handleAdd();
							}}
							data-testid={testIds.addInput}
							aria-label="New department name"
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

				{isLoading && <p className={css.stateMessage}>Loading departments…</p>}
				{isError && <p className={css.stateMessage}>Failed to load departments.</p>}

				{!isLoading && !isError && (
					<ul className={css.list} role="list">
						{departments.map((department: DepartmentWithCount) => {
							const activeEdit = card.editingState?.id === department.id ? card.editingState : null;
							return (
								<AttributeListItem
									key={department.id}
									item={department}
									leadingSlot={
										department.color && (
											<span
												className={css.colorSwatch}
												style={{ backgroundColor: department.color }}
												aria-hidden="true"
											/>
										)
									}
									isEditing={activeEdit !== null}
									editValue={activeEdit?.editValue ?? ''}
									editColor={activeEdit?.editColor ?? (department.color ?? DEFAULT_DEPARTMENT_COLOR)}
									editNameError={activeEdit?.nameError ?? undefined}
									onEditValueChange={card.handleEditValueChange}
									onEditColorChange={card.handleEditColorChange}
									onEditStart={card.handleEditStart}
									onEditConfirm={handleEditConfirm}
									onEditCancel={card.handleEditCancel}
									onDelete={handleDeleteDepartment}
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

DepartmentsCard.testIds = testIds;
