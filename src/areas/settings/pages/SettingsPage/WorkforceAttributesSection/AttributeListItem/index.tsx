import { Check, Pencil, Trash2, Users, X } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/common/components/ui/Button';

import type { AttributeItem } from '../useEditableAttributeCard';

import css from './AttributeListItem.module.scss';

const testIds = {
	item: (id: number) => `attribute-list-item-${id}`,
	editInput: (id: number) => `attribute-list-item-edit-input-${id}`,
	editConfirmButton: (id: number) => `attribute-list-item-edit-confirm-${id}`,
	editCancelButton: (id: number) => `attribute-list-item-edit-cancel-${id}`,
	editButton: (id: number) => `attribute-list-item-edit-${id}`,
	deleteButton: (id: number) => `attribute-list-item-delete-${id}`,
};

export type AttributeListItemProps = {
	item: AttributeItem,
	/** Optional decoration rendered before the item name (e.g. a colour swatch or an icon). */
	leadingSlot?: ReactNode,
	isEditing: boolean,
	editValue: string,
	/** When provided, a colour picker is shown in edit mode (e.g. for DepartmentsCard). */
	editColor?: string,
	editNameError?: string,
	onEditValueChange: (value: string) => void,
	/** Required when editColor is provided. */
	onEditColorChange?: (color: string) => void,
	onEditStart: (id: number) => void,
	onEditConfirm: () => void,
	onEditCancel: () => void,
	onDelete: (id: number) => void,
	onReassignAndDelete: (id: number) => void,
	isUpdatePending: boolean,
	isDeletePending: boolean,
};

export const AttributeListItem = ({
	item,
	leadingSlot,
	isEditing,
	editValue,
	editColor,
	editNameError,
	onEditValueChange,
	onEditColorChange,
	onEditStart,
	onEditConfirm,
	onEditCancel,
	onDelete,
	onReassignAndDelete,
	isUpdatePending,
	isDeletePending,
}: AttributeListItemProps) => {
	const hasAssignedEmployees = item.totalEmployees > 0;

	const handleEditStartClick = () => onEditStart(item.id);
	const handleDeleteClick = () => {
		if (hasAssignedEmployees) {
			onReassignAndDelete(item.id);
		}
		else {
			onDelete(item.id);
		}
	};

	if (isEditing) {
		return (
			<li className={css.item} data-testid={testIds.item(item.id)}>
				<div className={css.editRow}>
					{editColor !== undefined && (
						<input
							type="color"
							className={css.colorInput}
							value={editColor}
							onChange={(e) => onEditColorChange?.(e.target.value)}
							aria-label={`${item.name} colour`}
						/>
					)}
					<div className={css.editInputWrapper}>
						<input
							className={css.editInput}
							value={editValue}
							onChange={(e) => onEditValueChange(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') onEditConfirm();
								if (e.key === 'Escape') onEditCancel();
							}}
							data-testid={testIds.editInput(item.id)}
							aria-label={`Edit name for ${item.name}`}
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
							data-testid={testIds.editConfirmButton(item.id)}
							aria-label="Confirm edit"
						>
							<Check />
						</Button>
						<Button
							variant="outline"
							size="icon"
							onClick={onEditCancel}
							data-testid={testIds.editCancelButton(item.id)}
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
		<li className={css.item} data-testid={testIds.item(item.id)}>
			{leadingSlot}
			<span className={css.name}>{item.name}</span>
			<div className={css.meta}>
				<span className={css.employeeCount}>
					<Users size={16} aria-hidden="true" />
					{item.totalEmployees}
				</span>
				<Button
					variant="ghost"
					size="icon"
					onClick={handleEditStartClick}
					data-testid={testIds.editButton(item.id)}
					aria-label={`Edit ${item.name}`}
				>
					<Pencil />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={handleDeleteClick}
					disabled={isDeletePending}
					data-testid={testIds.deleteButton(item.id)}
					aria-label={
						hasAssignedEmployees
							? `Reassign employees and delete ${item.name}`
							: `Delete ${item.name}`
					}
				>
					<Trash2 />
				</Button>
			</div>
		</li>
	);
};

AttributeListItem.testIds = testIds;
