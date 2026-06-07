import { useCallback, useMemo, useState } from 'react';
import { MapPin, Plus } from 'lucide-react';

import { useLocationActions } from '@/areas/employees/hooks/useLocationActions';
import type { LocationWithCount } from '@/areas/employees/service/locationService';
import { useLocations } from '@/areas/settings/hooks/useLocations';
import { Button } from '@/common/components/ui/Button';

import { ReassignAndDeleteModal } from '../ReassignAndDeleteModal';
import { LocationListItem } from './LocationListItem';

import css from './LocationsCard.module.scss';

const DUPLICATE_NAME_ERROR = 'A location with this name already exists' as const;

type EditingState = {
	locationId: number,
	editValue: string,
	nameError: string | null,
} | null;

type ReassignDeleteState = {
	id: number,
	name: string,
	totalEmployees: number,
} | null;

function isDuplicateName(name: string, locations: LocationWithCount[], excludeId?: number): boolean {
	const normalised = name.trim().toLowerCase();
	return locations.some(l => l.name.toLowerCase() === normalised && l.id !== excludeId);
}

const testIds = {
	card: 'locations-card',
	addInput: 'locations-card-add-input',
	addButton: 'locations-card-add-button',
};

export const LocationsCard = () => {
	const { locations, isLoading, isError } = useLocations();

	const [newLocationName, setNewLocationName] = useState('');
	const [newLocationNameError, setNewLocationNameError] = useState<string | null>(null);
	const [editingState, setEditingState] = useState<EditingState>(null);
	const [reassignDeleteState, setReassignDeleteState] = useState<ReassignDeleteState>(null);

	const { handleCreateLocation, handleUpdateLocation, handleDeleteLocation, isCreatePending, isUpdatePending, isDeletePending } = useLocationActions({
		onCreateSuccess: () => setNewLocationName(''),
		onUpdateSuccess: () => setEditingState(null),
		onDeleteSuccess: () => setReassignDeleteState(null),
	});

	const handleAdd = useCallback(() => {
		const trimmedName = newLocationName.trim();
		if (!trimmedName) return;
		if (isDuplicateName(trimmedName, locations)) {
			setNewLocationNameError(DUPLICATE_NAME_ERROR);
			return;
		}
		setNewLocationNameError(null);
		handleCreateLocation(trimmedName);
	}, [newLocationName, locations, handleCreateLocation]);

	const handleNewNameChange = useCallback((value: string) => {
		setNewLocationName(value);
		if (newLocationNameError) setNewLocationNameError(null);
	}, [newLocationNameError]);

	const handleEditStart = useCallback((locationId: number) => {
		const location = locations.find((l: LocationWithCount) => l.id === locationId);
		if (!location) return;
		setEditingState({ locationId, editValue: location.name, nameError: null });
	}, [locations]);

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
		if (isDuplicateName(trimmedName, locations, editingState.locationId)) {
			setEditingState((prev) => prev ? { ...prev, nameError: DUPLICATE_NAME_ERROR } : null);
			return;
		}
		handleUpdateLocation(editingState.locationId, trimmedName);
	}, [editingState, locations, handleUpdateLocation]);

	const handleEditCancel = useCallback(() => {
		setEditingState(null);
	}, []);

	const handleDelete = useCallback((locationId: number) => {
		handleDeleteLocation(locationId);
	}, [handleDeleteLocation]);

	const handleReassignAndDeleteRequest = useCallback((locationId: number) => {
		const loc = locations.find((l: LocationWithCount) => l.id === locationId);
		if (!loc) return;
		setReassignDeleteState({ id: loc.id, name: loc.name, totalEmployees: loc.totalEmployees });
	}, [locations]);

	const handleReassignAndDeleteConfirm = useCallback((newLocationId: number) => {
		if (!reassignDeleteState) return;
		handleDeleteLocation(reassignDeleteState.id, newLocationId);
	}, [reassignDeleteState, handleDeleteLocation]);

	const replacementLocationOptions = useMemo(
		() => locations
			.filter((l: LocationWithCount) => l.id !== reassignDeleteState?.id)
			.map((l: LocationWithCount) => ({ value: String(l.id), label: l.name })),
		[locations, reassignDeleteState?.id]
	);

	return (
		<>
			<div data-testid={testIds.card}>
				<div className={css.header}>
					<div className={css.headerIcon}>
						<MapPin size={20} aria-hidden="true" />
					</div>
					<div>
						<h3 className={css.title}>Locations</h3>
						<p className={css.subtitle}>Office and work locations</p>
					</div>
				</div>

				<div className={css.addRow}>
					<div className={css.addInputWrapper}>
						<input
							className={css.addInput}
							placeholder="New location name"
							value={newLocationName}
							onChange={(e) => handleNewNameChange(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') handleAdd();
							}}
							data-testid={testIds.addInput}
							aria-label="New location name"
						/>
						{newLocationNameError && <p className={css.errorText}>{newLocationNameError}</p>}
					</div>
					<Button
						onClick={handleAdd}
						disabled={!newLocationName.trim() || isCreatePending}
						data-testid={testIds.addButton}
						className={css.addButton}
					>
						<Plus />
						Add
					</Button>
				</div>

				{isLoading && <p className={css.stateMessage}>Loading locations…</p>}
				{isError && <p className={css.stateMessage}>Failed to load locations.</p>}

				{!isLoading && !isError && (
					<ul className={css.list} role="list">
						{locations.map((location: LocationWithCount) => {
							const activeEdit = editingState?.locationId === location.id ? editingState : null;
							return (
								<LocationListItem
									key={location.id}
									location={location}
									isEditing={activeEdit !== null}
									editValue={activeEdit?.editValue ?? ''}
									editNameError={activeEdit?.nameError ?? undefined}
									onEditValueChange={handleEditValueChange}
									onEditStart={handleEditStart}
									onEditConfirm={handleEditConfirm}
									onEditCancel={handleEditCancel}
									onDelete={handleDelete} onReassignAndDelete={handleReassignAndDeleteRequest} isUpdatePending={isUpdatePending}
									isDeletePending={isDeletePending}
								/>
							);
						})}
					</ul>
				)}
			</div>

			<ReassignAndDeleteModal
				isOpen={reassignDeleteState !== null}
				onClose={() => setReassignDeleteState(null)}
				attributeLabel={reassignDeleteState?.name ?? ''}
				totalAssignedEmployees={reassignDeleteState?.totalEmployees ?? 0}
				replacementOptions={replacementLocationOptions}
				onConfirm={handleReassignAndDeleteConfirm}
				isPending={isDeletePending}
			/>
		</>
	);
};

LocationsCard.testIds = testIds;
