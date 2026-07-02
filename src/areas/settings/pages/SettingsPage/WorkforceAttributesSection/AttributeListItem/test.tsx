import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { AttributeItem } from '../useEditableAttributeCard';
import { AttributeListItem, type AttributeListItemProps } from '.';

const ITEM_ID = 1;

const MOCK_ITEM: AttributeItem = {
	id: ITEM_ID,
	name: 'Engineering',
	totalEmployees: 0,
};

const defaultProps: AttributeListItemProps = {
	item: MOCK_ITEM,
	isEditing: false,
	editValue: '',
	onEditValueChange: vi.fn(),
	onEditStart: vi.fn(),
	onEditConfirm: vi.fn(),
	onEditCancel: vi.fn(),
	onDelete: vi.fn(),
	onReassignAndDelete: vi.fn(),
	isUpdatePending: false,
	isDeletePending: false,
};

const testIds = AttributeListItem.testIds;

function renderItem(overrides: Partial<AttributeListItemProps> = {}) {
	render(<AttributeListItem {...defaultProps} {...overrides} />);
}

describe('<AttributeListItem />', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('view mode', () => {
		it('renders the item name', () => {
			renderItem();
			expect(screen.getByText(MOCK_ITEM.name)).toBeInTheDocument();
		});

		it('renders the employee count', () => {
			renderItem({ item: { ...MOCK_ITEM, totalEmployees: 7 } });
			expect(screen.getByText('7')).toBeInTheDocument();
		});

		it('renders the leadingSlot when provided', () => {
			renderItem({ leadingSlot: <span data-testid="leading-slot" /> });
			expect(screen.getByTestId('leading-slot')).toBeInTheDocument();
		});

		it('calls onEditStart with the item id when the edit button is clicked', async () => {
			const user = userEvent.setup();
			renderItem();
			await user.click(screen.getByTestId(testIds.editButton(ITEM_ID)));
			expect(defaultProps.onEditStart).toHaveBeenCalledWith(ITEM_ID);
		});

		it('calls onDelete with the item id when there are no assigned employees', async () => {
			const user = userEvent.setup();
			renderItem({ item: { ...MOCK_ITEM, totalEmployees: 0 } });
			await user.click(screen.getByTestId(testIds.deleteButton(ITEM_ID)));
			expect(defaultProps.onDelete).toHaveBeenCalledWith(ITEM_ID);
			expect(defaultProps.onReassignAndDelete).not.toHaveBeenCalled();
		});

		it('calls onReassignAndDelete when there are assigned employees', async () => {
			const user = userEvent.setup();
			renderItem({ item: { ...MOCK_ITEM, totalEmployees: 3 } });
			await user.click(screen.getByTestId(testIds.deleteButton(ITEM_ID)));
			expect(defaultProps.onReassignAndDelete).toHaveBeenCalledWith(ITEM_ID);
			expect(defaultProps.onDelete).not.toHaveBeenCalled();
		});

		it('disables the delete button when isDeletePending is true', () => {
			renderItem({ isDeletePending: true });
			expect(screen.getByTestId(testIds.deleteButton(ITEM_ID))).toBeDisabled();
		});
	});

	describe('edit mode', () => {
		const editingProps: Partial<AttributeListItemProps> = {
			isEditing: true,
			editValue: 'Engineering',
		};

		it('renders the edit input with the current editValue', () => {
			renderItem(editingProps);
			expect(screen.getByTestId<HTMLInputElement>(testIds.editInput(ITEM_ID)).value).toBe('Engineering');
		});

		it('calls onEditValueChange when the edit input changes', async () => {
			const user = userEvent.setup();
			renderItem({ ...editingProps, editValue: '' });
			await user.type(screen.getByTestId(testIds.editInput(ITEM_ID)), 'D');
			expect(defaultProps.onEditValueChange).toHaveBeenCalledWith('D');
		});

		it('calls onEditConfirm when Enter is pressed in the edit input', async () => {
			const user = userEvent.setup();
			renderItem(editingProps);
			await user.type(screen.getByTestId(testIds.editInput(ITEM_ID)), '{Enter}');
			expect(defaultProps.onEditConfirm).toHaveBeenCalled();
		});

		it('calls onEditCancel when Escape is pressed in the edit input', async () => {
			const user = userEvent.setup();
			renderItem(editingProps);
			await user.type(screen.getByTestId(testIds.editInput(ITEM_ID)), '{Escape}');
			expect(defaultProps.onEditCancel).toHaveBeenCalled();
		});

		it('calls onEditConfirm when the confirm button is clicked', async () => {
			const user = userEvent.setup();
			renderItem(editingProps);
			await user.click(screen.getByTestId(testIds.editConfirmButton(ITEM_ID)));
			expect(defaultProps.onEditConfirm).toHaveBeenCalled();
		});

		it('calls onEditCancel when the cancel button is clicked', async () => {
			const user = userEvent.setup();
			renderItem(editingProps);
			await user.click(screen.getByTestId(testIds.editCancelButton(ITEM_ID)));
			expect(defaultProps.onEditCancel).toHaveBeenCalled();
		});

		it('shows the error text when editNameError is provided', () => {
			renderItem({ ...editingProps, editNameError: 'A department with this name already exists' });
			expect(screen.getByText('A department with this name already exists')).toBeInTheDocument();
		});

		it('renders a colour picker when editColor is provided', () => {
			renderItem({ ...editingProps, editColor: '#6366f1' });
			expect(screen.getByLabelText(`${MOCK_ITEM.name} colour`)).toBeInTheDocument();
		});

		it('does not render a colour picker when editColor is not provided', () => {
			renderItem(editingProps);
			expect(screen.queryByLabelText(`${MOCK_ITEM.name} colour`)).not.toBeInTheDocument();
		});

		it.todo('disables the confirm button when isUpdatePending is true');
		it.todo('calls onEditColorChange when the colour picker changes');
	});
});
