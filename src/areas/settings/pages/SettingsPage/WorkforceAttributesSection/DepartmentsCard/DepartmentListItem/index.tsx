import { Check, Pencil, Trash2, Users, X } from 'lucide-react';

import type { DepartmentWithCount } from '@/areas/employees/service/departmentService';
import { Button } from '@/common/components/ui/Button';

import css from './DepartmentListItem.module.scss';

const testIds = {
	item: (id: number) => `department-list-item-${id}`,
	editInput: (id: number) => `department-list-item-edit-input-${id}`,
	editConfirmButton: (id: number) => `department-list-item-edit-confirm-${id}`,
	editCancelButton: (id: number) => `department-list-item-edit-cancel-${id}`,
	editButton: (id: number) => `department-list-item-edit-${id}`,
	deleteButton: (id: number) => `department-list-item-delete-${id}`,
};

export type DepartmentListItemProps = {
	department: DepartmentWithCount,
	isEditing: boolean,
	editValue: string,
	editNameError?: string,
	onEditValueChange: (value: string) => void,
	onEditStart: (departmentId: number) => void,
	onEditConfirm: () => void,
	onEditCancel: () => void,
	onDelete: (departmentId: number) => void,
	isUpdatePending: boolean,
	isDeletePending: boolean,
};

export const DepartmentListItem = ({
	department,
	isEditing,
	editValue,
	editNameError,
	onEditValueChange,
	onEditStart,
	onEditConfirm,
	onEditCancel,
	onDelete,
	isUpdatePending,
	isDeletePending,
}: DepartmentListItemProps) => {
	const hasAssignedEmployees = department.totalEmployees > 0;

	if (isEditing) {
		return (
			<li className={css.item} data-testid={testIds.item(department.id)}>
				<div className={css.editRow}>
					<div className={css.editInputWrapper}>
						<input
							className={css.editInput}
							value={editValue}
							onChange={(e) => onEditValueChange(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') onEditConfirm();
								if (e.key === 'Escape') onEditCancel();
							}}
							data-testid={testIds.editInput(department.id)}
							aria-label={`Edit department name for ${department.name}`}
							aria-invalid={!!editNameError}
							autoFocus
						/>
						{editNameError && <p className={css.errorText}>{editNameError}</p>}
					</div>
					<div className={css.actions}>
						<Button
							variant="default"
							size="icon"
							onClick={onEditConfirm}
							disabled={isUpdatePending}
							data-testid={testIds.editConfirmButton(department.id)}
							aria-label="Confirm edit"
						>
							<Check />
						</Button>
						<Button
							variant="outline"
							size="icon"
							onClick={onEditCancel}
							data-testid={testIds.editCancelButton(department.id)}
							aria-label="Cancel edit"
						>
							<X />
						</Button>
					</div>
				</div>
			</li>
		);
	}

	return (
		<li className={css.item} data-testid={testIds.item(department.id)}>
			<span className={css.name}>{department.name}</span>
			<div className={css.meta}>
				<span className={css.employeeCount}>
					<Users size={16} aria-hidden="true" />
					{department.totalEmployees}
				</span>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onEditStart(department.id)}
					data-testid={testIds.editButton(department.id)}
					aria-label={`Edit ${department.name}`}
				>
					<Pencil />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onDelete(department.id)}
					disabled={hasAssignedEmployees || isDeletePending}
					data-testid={testIds.deleteButton(department.id)}
					aria-label={`Delete ${department.name}`}
				>
					<Trash2 />
				</Button>
			</div>
		</li>
	);
};

DepartmentListItem.testIds = testIds;
