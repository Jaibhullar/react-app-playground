import { useCallback } from 'react';
import { MapPin, Plus } from 'lucide-react';

import { useLocationActions } from '@/areas/employees/hooks/useLocationActions';
import type { LocationWithCount } from '@/areas/employees/service/locationService';
import { useLocations } from '@/areas/settings/hooks/useLocations';
import { Button } from '@/common/components/ui/Button';

import { AttributeListItem } from '../AttributeListItem';
import { ReassignAndDeleteModal } from '../ReassignAndDeleteModal';
import { useEditableAttributeCard } from '../useEditableAttributeCard';

import css from './LocationsCard.module.scss';

const DUPLICATE_NAME_ERROR = 'A location with this name already exists' as const;

const testIds = {
	card: 'locations-card',
	addInput: 'locations-card-add-input',
	addButton: 'locations-card-add-button',
};

export const LocationsCard = () => {
	const { locations, isLoading, isError } = useLocations();

	const card = useEditableAttributeCard({
		items: locations,
		duplicateNameErrorMessage: DUPLICATE_NAME_ERROR,
	});

	const { handleCreateLocation, handleUpdateLocation, handleDeleteLocation, isCreatePending, isUpdatePending, isDeletePending } = useLocationActions({
		onCreateSuccess: card.onAddSuccess,
		onUpdateSuccess: card.onUpdateSuccess,
		onDeleteSuccess: card.onDeleteSuccess,
		onDeleteConflict: card.handleDeleteConflict,
		onError: card.handleMutationError,
	});

	const handleAdd = useCallback(() => {
		const payload = card.tryAdd();
		if (payload) handleCreateLocation(payload.name);
	}, [card.tryAdd, handleCreateLocation]);

	const handleEditConfirm = useCallback(() => {
		const payload = card.tryUpdate();
		if (payload) handleUpdateLocation(payload.id, payload.name);
	}, [card.tryUpdate, handleUpdateLocation]);

	const handleReassignAndDeleteConfirm = useCallback((newLocationId: number) => {
		if (!card.reassignDeleteState) return;
		handleDeleteLocation(card.reassignDeleteState.id, newLocationId);
	}, [card.reassignDeleteState, handleDeleteLocation]);

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
							value={card.newName}
							onChange={(e) => card.handleNewNameChange(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') handleAdd();
							}}
							data-testid={testIds.addInput}
							aria-label="New location name"
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

				{card.mutationError && <p className={css.errorText}>{card.mutationError}</p>}
				{isLoading && <p className={css.stateMessage}>Loading locations…</p>}
				{isError && <p className={css.stateMessage}>Failed to load locations.</p>}

				{!isLoading && !isError && (
					<ul className={css.list} role="list">
						{locations.map((location: LocationWithCount) => {
							const activeEdit = card.editingState?.id === location.id ? card.editingState : null;
							return (
								<AttributeListItem
									key={location.id}
									item={location}
									leadingSlot={<MapPin size={16} aria-hidden="true" />}
									isEditing={activeEdit !== null}
									editValue={activeEdit?.editValue ?? ''}
									editNameError={activeEdit?.nameError ?? undefined}
									onEditValueChange={card.handleEditValueChange}
									onEditStart={card.handleEditStart}
									onEditConfirm={handleEditConfirm}
									onEditCancel={card.handleEditCancel}
									onDelete={handleDeleteLocation}
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

LocationsCard.testIds = testIds;
