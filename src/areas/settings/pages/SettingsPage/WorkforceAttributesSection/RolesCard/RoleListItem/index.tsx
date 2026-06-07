import { Briefcase, Check, Pencil, Trash2, Users, X } from 'lucide-react';

import type { RoleWithCount } from '@/areas/employees/service/roleService';
import { Button } from '@/common/components/ui/Button';

import css from './RoleListItem.module.scss';

const testIds = {
	item: (id: number) => `role-list-item-${id}`,
	editInput: (id: number) => `role-list-item-edit-input-${id}`,
	editConfirmButton: (id: number) => `role-list-item-edit-confirm-${id}`,
	editCancelButton: (id: number) => `role-list-item-edit-cancel-${id}`,
	editButton: (id: number) => `role-list-item-edit-${id}`,
	deleteButton: (id: number) => `role-list-item-delete-${id}`,
};

export type RoleListItemProps = {
	role: RoleWithCount,
	isEditing: boolean,
	editValue: string,
	editNameError?: string,
	onEditValueChange: (value: string) => void,
	onEditStart: (roleId: number) => void,
	onEditConfirm: () => void,
	onEditCancel: () => void,
	onDelete: (roleId: number) => void,
	onReassignAndDelete: (roleId: number) => void,
	isUpdatePending: boolean,
	isDeletePending: boolean,
};

export const RoleListItem = ({
	role,
	isEditing,
	editValue,
	editNameError,
	onEditValueChange,
	onEditStart,
	onEditConfirm,
	onEditCancel,
	onDelete,
	onReassignAndDelete,
	isUpdatePending,
	isDeletePending,
}: RoleListItemProps) => {
	const hasAssignedEmployees = role.totalEmployees > 0;

	if (isEditing) {
		return (
			<li className={css.item} data-testid={testIds.item(role.id)}>
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
							data-testid={testIds.editInput(role.id)}
							aria-label={`Edit role name for ${role.name}`}
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
							data-testid={testIds.editConfirmButton(role.id)}
							aria-label="Confirm edit"
						>
							<Check />
						</Button>
						<Button
							variant="outline"
							size="icon"
							onClick={onEditCancel}
							data-testid={testIds.editCancelButton(role.id)}
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
		<li className={css.item} data-testid={testIds.item(role.id)}>
			<Briefcase size={16} aria-hidden="true" />
			<span className={css.name}>{role.name}</span>
			<div className={css.meta}>
				<span className={css.employeeCount}>
					<Users size={16} aria-hidden="true" />
					{role.totalEmployees}
				</span>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onEditStart(role.id)}
					data-testid={testIds.editButton(role.id)}
					aria-label={`Edit ${role.name}`}
				>
					<Pencil />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => hasAssignedEmployees ? onReassignAndDelete(role.id) : onDelete(role.id)}
					disabled={isDeletePending}
					data-testid={testIds.deleteButton(role.id)}
					aria-label={hasAssignedEmployees ? `Reassign employees and delete ${role.name}` : `Delete ${role.name}`}
				>
					<Trash2 />
				</Button>
			</div>
		</li>
	);
};

RoleListItem.testIds = testIds;
