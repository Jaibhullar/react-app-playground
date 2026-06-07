import { Check, MapPin, Pencil, Trash2, Users, X } from 'lucide-react';

import type { LocationWithCount } from '@/areas/employees/service/locationService';
import { Button } from '@/common/components/ui/Button';

import css from './LocationListItem.module.scss';

const testIds = {
	item: (id: number) => `location-list-item-${id}`,
	editInput: (id: number) => `location-list-item-edit-input-${id}`,
	editConfirmButton: (id: number) => `location-list-item-edit-confirm-${id}`,
	editCancelButton: (id: number) => `location-list-item-edit-cancel-${id}`,
	editButton: (id: number) => `location-list-item-edit-${id}`,
	deleteButton: (id: number) => `location-list-item-delete-${id}`,
};

export type LocationListItemProps = {
	location: LocationWithCount,
	isEditing: boolean,
	editValue: string,
	editNameError?: string,
	onEditValueChange: (value: string) => void,
	onEditStart: (locationId: number) => void,
	onEditConfirm: () => void,
	onEditCancel: () => void,
	onDelete: (locationId: number) => void,
	onReassignAndDelete: (locationId: number) => void,
	isUpdatePending: boolean,
	isDeletePending: boolean,
};

export const LocationListItem = ({
	location,
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
}: LocationListItemProps) => {
	const hasAssignedEmployees = location.totalEmployees > 0;

	if (isEditing) {
		return (
			<li className={css.item} data-testid={testIds.item(location.id)}>
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
							data-testid={testIds.editInput(location.id)}
							aria-label={`Edit location name for ${location.name}`}
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
							data-testid={testIds.editConfirmButton(location.id)}
							aria-label="Confirm edit"
						>
							<Check />
						</Button>
						<Button
							variant="outline"
							size="icon"
							onClick={onEditCancel}
							data-testid={testIds.editCancelButton(location.id)}
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
		<li className={css.item} data-testid={testIds.item(location.id)}>
			<MapPin size={16} className={css.locationIcon} aria-hidden="true" />
			<span className={css.name}>{location.name}</span>
			<div className={css.meta}>
				<span className={css.employeeCount}>
					<Users size={16} aria-hidden="true" />
					{location.totalEmployees}
				</span>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onEditStart(location.id)}
					data-testid={testIds.editButton(location.id)}
					aria-label={`Edit ${location.name}`}
				>
					<Pencil />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => hasAssignedEmployees ? onReassignAndDelete(location.id) : onDelete(location.id)}
					disabled={isDeletePending}
					data-testid={testIds.deleteButton(location.id)}
					aria-label={hasAssignedEmployees ? `Reassign employees and delete ${location.name}` : `Delete ${location.name}`}
				>
					<Trash2 />
				</Button>
			</div>
		</li>
	);
};

LocationListItem.testIds = testIds;
