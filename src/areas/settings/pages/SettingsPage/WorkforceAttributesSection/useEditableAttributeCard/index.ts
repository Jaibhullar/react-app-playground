import { useCallback, useMemo, useState } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AttributeItem = {
	id: number,
	name: string,
	totalEmployees: number,
};

/** Payload returned by tryAdd once validation passes. */
export type AddPayload = {
	name: string,
	color: string,
};

/** Payload returned by tryUpdate once validation passes. */
export type UpdatePayload = {
	id: number,
	name: string,
	color: string,
};

type EditingState = {
	id: number,
	editValue: string,
	editColor: string,
	nameError: string | null,
} | null;

type ReassignDeleteState = {
	id: number,
	name: string,
	totalEmployees: number,
} | null;

export type UseEditableAttributeCardInput = {
	items: AttributeItem[],
	duplicateNameErrorMessage: string,
	/** Initial colour value for new-item and edit forms. Pass undefined when colour support is not needed. */
	defaultColor?: string,
};

export type UseEditableAttributeCardReturn = {
	// "new item" form state
	newName: string,
	newColor: string,
	newNameError: string | null,
	// edit state
	editingState: EditingState,
	// reassign-delete modal state
	reassignDeleteState: ReassignDeleteState,
	replacementOptions: Array<{
		value: string,
		label: string,
	}>,
	// "new item" handlers
	handleNewNameChange: (value: string) => void,
	handleNewColorChange: (color: string) => void,
	// edit handlers
	handleEditStart: (id: number) => void,
	handleEditValueChange: (value: string) => void,
	handleEditColorChange: (color: string) => void,
	handleEditCancel: () => void,
	// delete / reassign-modal handler
	handleDeleteOrReassignRequest: (id: number) => void,
	// Validation helpers — validate and return the payload, or set the error and return null
	tryAdd: () => AddPayload | null,
	tryUpdate: () => UpdatePayload | null,
	// Success callbacks — pass these to the corresponding actions hook
	onAddSuccess: () => void,
	onUpdateSuccess: () => void,
	onDeleteSuccess: () => void,
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

const DEFAULT_COLOR = '' as const;

function isDuplicateName(name: string, items: AttributeItem[], excludeId?: number): boolean {
	const normalised = name.trim().toLowerCase();
	return items.some((item) => item.name.toLowerCase() === normalised && item.id !== excludeId);
}

export function useEditableAttributeCard({
	items,
	duplicateNameErrorMessage,
	defaultColor,
}: UseEditableAttributeCardInput): UseEditableAttributeCardReturn {
	const resolvedDefaultColor = defaultColor ?? DEFAULT_COLOR;

	const [newName, setNewName] = useState('');
	const [newColor, setNewColor] = useState(resolvedDefaultColor);
	const [newNameError, setNewNameError] = useState<string | null>(null);
	const [editingState, setEditingState] = useState<EditingState>(null);
	const [reassignDeleteState, setReassignDeleteState] = useState<ReassignDeleteState>(null);

	// ---------------------------------------------------------------------------
	// "New item" handlers
	// ---------------------------------------------------------------------------

	const handleNewNameChange = useCallback((value: string) => {
		setNewName(value);
		if (newNameError) setNewNameError(null);
	}, [newNameError]);

	const handleNewColorChange = useCallback((color: string) => {
		setNewColor(color);
	}, []);

	// ---------------------------------------------------------------------------
	// Edit handlers
	// ---------------------------------------------------------------------------

	const handleEditStart = useCallback((id: number) => {
		const item = items.find((i) => i.id === id);
		if (!item) return;
		const color = (item as AttributeItem & {
			color?: string,
		}).color ?? resolvedDefaultColor;
		setEditingState({ id: item.id, editValue: item.name, editColor: color, nameError: null });
	}, [items, resolvedDefaultColor]);

	const handleEditValueChange = useCallback((value: string) => {
		setEditingState((prev) => {
			if (!prev) return null;
			return { ...prev, editValue: value, nameError: null };
		});
	}, []);

	const handleEditColorChange = useCallback((color: string) => {
		setEditingState((prev) => {
			if (!prev) return null;
			return { ...prev, editColor: color };
		});
	}, []);

	const handleEditCancel = useCallback(() => {
		setEditingState(null);
	}, []);

	// ---------------------------------------------------------------------------
	// Delete / reassign handler
	// ---------------------------------------------------------------------------

	const handleDeleteOrReassignRequest = useCallback((id: number) => {
		const item = items.find((i) => i.id === id);
		if (!item) return;
		setReassignDeleteState({ id: item.id, name: item.name, totalEmployees: item.totalEmployees });
	}, [items]);

	// ---------------------------------------------------------------------------
	// Validation helpers
	// ---------------------------------------------------------------------------

	const tryAdd = useCallback((): AddPayload | null => {
		const trimmedName = newName.trim();
		if (!trimmedName) return null;
		if (isDuplicateName(trimmedName, items)) {
			setNewNameError(duplicateNameErrorMessage);
			return null;
		}
		setNewNameError(null);
		return { name: trimmedName, color: newColor };
	}, [newName, newColor, items, duplicateNameErrorMessage]);

	const tryUpdate = useCallback((): UpdatePayload | null => {
		if (!editingState) return null;
		const trimmedName = editingState.editValue.trim();
		if (!trimmedName) return null;
		if (isDuplicateName(trimmedName, items, editingState.id)) {
			setEditingState((prev) => (prev ? { ...prev, nameError: duplicateNameErrorMessage } : null));
			return null;
		}
		return { id: editingState.id, name: trimmedName, color: editingState.editColor };
	}, [editingState, items, duplicateNameErrorMessage]);

	// ---------------------------------------------------------------------------
	// Success callbacks (pass to the actions hook)
	// ---------------------------------------------------------------------------

	const onAddSuccess = useCallback(() => {
		setNewName('');
		setNewColor(resolvedDefaultColor);
	}, [resolvedDefaultColor]);

	const onUpdateSuccess = useCallback(() => {
		setEditingState(null);
	}, []);

	const onDeleteSuccess = useCallback(() => {
		setReassignDeleteState(null);
	}, []);

	// ---------------------------------------------------------------------------
	// Replacement options (for the reassign-and-delete modal)
	// ---------------------------------------------------------------------------

	const replacementOptions = useMemo(
		() =>
			items
				.filter((item) => item.id !== reassignDeleteState?.id)
				.map((item) => ({ value: String(item.id), label: item.name })),
		[items, reassignDeleteState?.id]
	);

	return {
		newName,
		newColor,
		newNameError,
		editingState,
		reassignDeleteState,
		replacementOptions,
		handleNewNameChange,
		handleNewColorChange,
		handleEditStart,
		handleEditValueChange,
		handleEditColorChange,
		handleEditCancel,
		handleDeleteOrReassignRequest,
		tryAdd,
		tryUpdate,
		onAddSuccess,
		onUpdateSuccess,
		onDeleteSuccess,
	};
}
