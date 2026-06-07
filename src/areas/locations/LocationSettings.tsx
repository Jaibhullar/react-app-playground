import { useCallback, useState } from 'react';

import { Button } from '@/common/components/ui/Button';

import { useLocationFormDrawer } from './hooks/useLocationFormDrawer';
import { useLocationMutations } from './hooks/useLocationMutations';
import { useLocations } from './hooks/useLocations';
import type { LocationListItem } from './types';

export const LocationSettings = () => {
	const { locations, isLoading, isError } = useLocations();
	const { drawerState, isOpen, openCreate, openEdit, close } = useLocationFormDrawer();

	const [formName, setFormName] = useState('');
	const [confirmEditChecked, setConfirmEditChecked] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);

	const { createLocation, isCreatingLocation, updateLocation, isUpdatingLocation, deleteLocation, isDeletingLocation } = useLocationMutations({
		onCreateSuccess: close,
		onCreateError: setFormError,
		onUpdateSuccess: close,
		onUpdateError: setFormError,
	});

	const isDuplicateName = (() => {
		const trimmed = formName.trim().toLowerCase();
		if (!trimmed) return false;
		return locations.some(l =>
			l.name.toLowerCase() === trimmed &&
			(drawerState?.mode !== 'edit' || l.id !== drawerState.location.id)
		);
	})();

	const isSubmitting = isCreatingLocation || isUpdatingLocation;
	const isEditingAssigned = drawerState?.mode === 'edit' && drawerState.location.assignedEmployeeCount > 0;
	const canSubmit = !isSubmitting && formName.trim().length > 0 && !isDuplicateName && (!isEditingAssigned || confirmEditChecked);

	const handleOpenCreate = useCallback(() => {
		setFormName('');
		setConfirmEditChecked(false);
		setFormError(null);
		openCreate();
	}, [openCreate]);

	const handleOpenEdit = useCallback((location: LocationListItem) => {
		setFormName(location.name);
		setConfirmEditChecked(false);
		setFormError(null);
		openEdit(location);
	}, [openEdit]);

	const handleSubmit = useCallback(() => {
		if (!drawerState || !formName.trim()) return;

		if (drawerState.mode === 'create') {
			createLocation(formName.trim());
		}
		else {
			updateLocation({ ...drawerState.location, name: formName.trim() });
		}
	}, [createLocation, drawerState, formName, updateLocation]);

	if (isLoading) {
		return <p>Loading locations...</p>;
	}

	if (isError) {
		return <p>Error loading locations.</p>;
	}

	return (
		<>
			<h2>Locations</h2>

			<Button onClick={handleOpenCreate}>Add location</Button>

			{locations.length === 0
				? <p>No locations found.</p>
				: (
					<ul>
						{locations.map((location: LocationListItem) => (
							<li key={location.id}>
								{location.name}
								<Button variant="outline" size="sm" onClick={() => handleOpenEdit(location)}>Edit</Button>
								{location.assignedEmployeeCount > 0
									? <span>{location.assignedEmployeeCount} employee(s) assigned — cannot delete</span>
									: <Button variant="destructive" size="sm" onClick={() => deleteLocation(location.id)} disabled={isDeletingLocation}>Delete</Button>
								}
							</li>
						))}
					</ul>
				)
			}

			{isOpen && drawerState && (
				<div role="dialog" aria-label={drawerState.mode === 'create' ? 'Add location' : 'Edit location'}>
					<input
						type="text"
						placeholder="Location name"
						value={formName}
						onChange={(e) => {
							setFormName(e.target.value); setFormError(null);
						}}
					/>
					{isDuplicateName && (
						<p role="alert">A location with this name already exists.</p>
					)}
					{formError && (
						<p role="alert">{formError}</p>
					)}
					{isEditingAssigned && (
						<>
							<p role="alert">
								Warning: this location is assigned to {drawerState.mode === 'edit' && drawerState.location.assignedEmployeeCount} employee(s). Renaming it will affect all assigned employees.
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
