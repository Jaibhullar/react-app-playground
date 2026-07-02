import { act, renderHook } from '@testing-library/react';

import {
	type AddPayload,
	type AttributeItem,
	useEditableAttributeCard,
	type UseEditableAttributeCardInput
} from '.';

const ITEMS: AttributeItem[] = [
	{ id: 1, name: 'Engineering', totalEmployees: 5 },
	{ id: 2, name: 'Marketing', totalEmployees: 3 },
];

const DUPLICATE_NAME_ERROR = 'A department with this name already exists';
const DEFAULT_COLOR = '#6366f1';

const defaultInput: UseEditableAttributeCardInput = {
	items: ITEMS,
	duplicateNameErrorMessage: DUPLICATE_NAME_ERROR,
	defaultColor: DEFAULT_COLOR,
};

describe('useEditableAttributeCard', () => {
	it('returns an empty newName with no error initially', () => {
		const { result } = renderHook(() => useEditableAttributeCard(defaultInput));
		expect(result.current.newName).toBe('');
		expect(result.current.newNameError).toBeNull();
	});

	it('uses the defaultColor as the initial newColor', () => {
		const { result } = renderHook(() => useEditableAttributeCard(defaultInput));
		expect(result.current.newColor).toBe(DEFAULT_COLOR);
	});

	describe('tryAdd', () => {
		it('returns null when newName is empty', () => {
			const { result } = renderHook(() => useEditableAttributeCard(defaultInput));
			let payload: AddPayload | null = null;
			act(() => {
				payload = result.current.tryAdd();
			});
			expect(payload).toBeNull();
		});

		it('sets newNameError and returns null when the name is a duplicate', () => {
			const { result } = renderHook(() => useEditableAttributeCard(defaultInput));
			act(() => {
				result.current.handleNewNameChange('Engineering');
			});
			let payload: AddPayload | null = null;
			act(() => {
				payload = result.current.tryAdd();
			});
			expect(payload).toBeNull();
			expect(result.current.newNameError).toBe(DUPLICATE_NAME_ERROR);
		});

		it('is case-insensitive when checking for duplicates', () => {
			const { result } = renderHook(() => useEditableAttributeCard(defaultInput));
			act(() => {
				result.current.handleNewNameChange('ENGINEERING');
			});
			let payload: AddPayload | null = null;
			act(() => {
				payload = result.current.tryAdd();
			});
			expect(payload).toBeNull();
		});

		it('returns the name and color payload when the name is valid', () => {
			const { result } = renderHook(() => useEditableAttributeCard(defaultInput));
			act(() => {
				result.current.handleNewNameChange('Design');
			});
			let payload: AddPayload | null = null;
			act(() => {
				payload = result.current.tryAdd();
			});
			expect(payload).toEqual({ name: 'Design', color: DEFAULT_COLOR });
			expect(result.current.newNameError).toBeNull();
		});

		it('trims leading/trailing whitespace from the name before returning', () => {
			const { result } = renderHook(() => useEditableAttributeCard(defaultInput));
			act(() => {
				result.current.handleNewNameChange('  Design  ');
			});
			let payload: AddPayload | null = null;
			act(() => {
				payload = result.current.tryAdd();
			});
			expect(payload).toEqual({ name: 'Design', color: DEFAULT_COLOR });
		});
	});

	describe('handleEditStart', () => {
		it('sets editingState with the matching item values', () => {
			const { result } = renderHook(() => useEditableAttributeCard(defaultInput));
			act(() => {
				result.current.handleEditStart(1);
			});
			expect(result.current.editingState).toMatchObject({
				id: 1,
				editValue: 'Engineering',
				nameError: null,
			});
		});

		it('does nothing when the id does not match any item', () => {
			const { result } = renderHook(() => useEditableAttributeCard(defaultInput));
			act(() => {
				result.current.handleEditStart(999);
			});
			expect(result.current.editingState).toBeNull();
		});
	});

	describe('handleEditCancel', () => {
		it('clears editingState', () => {
			const { result } = renderHook(() => useEditableAttributeCard(defaultInput));
			act(() => {
				result.current.handleEditStart(1);
			});
			act(() => {
				result.current.handleEditCancel();
			});
			expect(result.current.editingState).toBeNull();
		});
	});

	describe('handleNewNameChange', () => {
		it('updates newName', () => {
			const { result } = renderHook(() => useEditableAttributeCard(defaultInput));
			act(() => {
				result.current.handleNewNameChange('Design');
			});
			expect(result.current.newName).toBe('Design');
		});

		it('clears newNameError when the user types after a validation failure', () => {
			const { result } = renderHook(() => useEditableAttributeCard(defaultInput));
			// trigger an error first
			act(() => {
				result.current.handleNewNameChange('Engineering');
			});
			act(() => {
				result.current.tryAdd();
			});
			expect(result.current.newNameError).not.toBeNull();
			// now type again
			act(() => {
				result.current.handleNewNameChange('Design');
			});
			expect(result.current.newNameError).toBeNull();
		});
	});

	describe('onAddSuccess', () => {
		it('resets newName to empty', () => {
			const { result } = renderHook(() => useEditableAttributeCard(defaultInput));
			act(() => {
				result.current.handleNewNameChange('Design');
			});
			act(() => {
				result.current.onAddSuccess();
			});
			expect(result.current.newName).toBe('');
		});

		it('resets newColor to the defaultColor', () => {
			const { result } = renderHook(() => useEditableAttributeCard(defaultInput));
			act(() => {
				result.current.handleNewColorChange('#ff0000');
			});
			act(() => {
				result.current.onAddSuccess();
			});
			expect(result.current.newColor).toBe(DEFAULT_COLOR);
		});
	});

	describe('onUpdateSuccess', () => {
		it('clears editingState', () => {
			const { result } = renderHook(() => useEditableAttributeCard(defaultInput));
			act(() => {
				result.current.handleEditStart(1);
			});
			act(() => {
				result.current.onUpdateSuccess();
			});
			expect(result.current.editingState).toBeNull();
		});
	});

	describe('onDeleteSuccess', () => {
		it('clears reassignDeleteState', () => {
			const { result } = renderHook(() => useEditableAttributeCard(defaultInput));
			act(() => {
				result.current.handleDeleteOrReassignRequest(1);
			});
			act(() => {
				result.current.onDeleteSuccess();
			});
			expect(result.current.reassignDeleteState).toBeNull();
		});
	});

	describe('replacementOptions', () => {
		it('includes all items as options when nothing is being deleted', () => {
			const { result } = renderHook(() => useEditableAttributeCard(defaultInput));
			expect(result.current.replacementOptions).toHaveLength(ITEMS.length);
		});

		it('excludes the item being deleted from the options', () => {
			const { result } = renderHook(() => useEditableAttributeCard(defaultInput));
			act(() => {
				result.current.handleDeleteOrReassignRequest(1);
			});
			expect(result.current.replacementOptions).toHaveLength(1);
			expect(result.current.replacementOptions[0].value).toBe('2');
		});
	});

	it.todo('tryUpdate sets nameError and returns null when the edited name is a duplicate of another item');
	it.todo('tryUpdate returns the updated payload (id, name, color) when the edit is valid');
	it.todo('tryUpdate allows saving the unchanged name of the item being edited');
});
