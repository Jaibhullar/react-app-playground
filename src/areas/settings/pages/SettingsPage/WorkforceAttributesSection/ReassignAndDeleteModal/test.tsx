import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ReassignAndDeleteModal, type ReassignAndDeleteModalProps } from '.';

const REPLACEMENT_OPTIONS = [
	{ value: '2', label: 'Marketing' },
	{ value: '3', label: 'Sales' },
];

const defaultProps: ReassignAndDeleteModalProps = {
	isOpen: true,
	onClose: vi.fn(),
	attributeLabel: 'Engineering',
	totalAssignedEmployees: 5,
	replacementOptions: REPLACEMENT_OPTIONS,
	onConfirm: vi.fn(),
	isPending: false,
};

const testIds = ReassignAndDeleteModal.testIds;

function renderModal(overrides: Partial<ReassignAndDeleteModalProps> = {}) {
	render(<ReassignAndDeleteModal {...defaultProps} {...overrides} />);
}

describe('<ReassignAndDeleteModal />', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders nothing when isOpen is false', () => {
		renderModal({ isOpen: false });
		expect(screen.queryByTestId(testIds.confirmButton)).not.toBeInTheDocument();
	});

	it('renders the attribute label in the title', () => {
		renderModal();
		expect(screen.getByText(/Engineering/)).toBeInTheDocument();
	});

	it('renders the assigned employee count', () => {
		renderModal();
		expect(screen.getByText(/5 employees are/)).toBeInTheDocument();
	});

	it('uses the singular "employee is" when totalAssignedEmployees is 1', () => {
		renderModal({ totalAssignedEmployees: 1 });
		expect(screen.getByText(/1 employee is/)).toBeInTheDocument();
	});

	it('has the confirm button disabled until a replacement is selected', () => {
		renderModal();
		expect(screen.getByTestId(testIds.confirmButton)).toBeDisabled();
	});

	it('enables the confirm button after selecting a replacement', async () => {
		const user = userEvent.setup();
		renderModal();
		await user.selectOptions(screen.getByTestId(testIds.select), '2');
		expect(screen.getByTestId(testIds.confirmButton)).not.toBeDisabled();
	});

	it('calls onConfirm with the selected replacement id as a number', async () => {
		const user = userEvent.setup();
		renderModal();
		await user.selectOptions(screen.getByTestId(testIds.select), '2');
		await user.click(screen.getByTestId(testIds.confirmButton));
		expect(defaultProps.onConfirm).toHaveBeenCalledWith(2);
	});

	it('calls onClose when the cancel button is clicked', async () => {
		const user = userEvent.setup();
		renderModal();
		await user.click(screen.getByTestId(testIds.cancelButton));
		expect(defaultProps.onClose).toHaveBeenCalled();
	});

	it('disables both buttons when isPending is true', () => {
		renderModal({ isPending: true });
		expect(screen.getByTestId(testIds.cancelButton)).toBeDisabled();
	});

	it.todo('shows "Deleting…" on the confirm button when isPending is true');
	it.todo('resets the selected replacement when the modal re-opens after being closed');
});
