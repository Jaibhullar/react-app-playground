import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useDepartmentActions, type UseDepartmentActionsReturn } from '@/areas/employees/hooks/useDepartmentActions';
import type { DepartmentWithCount } from '@/areas/employees/service/departmentService';
import { useDepartments, type UseDepartmentsReturn } from '@/areas/settings/hooks/useDepartments';

import { AttributeListItem, type AttributeListItemProps } from '../AttributeListItem';
import { ReassignAndDeleteModal } from '../ReassignAndDeleteModal';
import { useEditableAttributeCard, type UseEditableAttributeCardReturn } from '../useEditableAttributeCard';
import { DepartmentsCard } from '.';

vi.mock('@/areas/settings/hooks/useDepartments');
vi.mock('@/areas/employees/hooks/useDepartmentActions');
vi.mock('../useEditableAttributeCard');
vi.mock('../AttributeListItem');
vi.mock('../ReassignAndDeleteModal');

const mockUseDepartments = vi.mocked(useDepartments);
const mockUseDepartmentActions = vi.mocked(useDepartmentActions);
const mockUseEditableAttributeCard = vi.mocked(useEditableAttributeCard);

const MOCK_DEPARTMENT: DepartmentWithCount = {
	id: 1,
	name: 'Engineering',
	color: '#6366f1',
	totalEmployees: 5,
};

const defaultDepartmentsReturn: UseDepartmentsReturn = {
	departments: [],
	isLoading: false,
	isError: false,
};

function buildDefaultActionsReturn(): UseDepartmentActionsReturn {
	return {
		handleCreateDepartment: vi.fn(),
		handleUpdateDepartment: vi.fn(),
		handleDeleteDepartment: vi.fn(),
		isCreatePending: false,
		isUpdatePending: false,
		isDeletePending: false,
	};
}

function buildDefaultCardReturn(): UseEditableAttributeCardReturn {
	return {
		newName: '',
		newColor: '#6366f1',
		newNameError: null,
		editingState: null,
		reassignDeleteState: null,
		replacementOptions: [],
		handleNewNameChange: vi.fn(),
		handleNewColorChange: vi.fn(),
		handleEditStart: vi.fn(),
		handleEditValueChange: vi.fn(),
		handleEditColorChange: vi.fn(),
		handleEditCancel: vi.fn(),
		handleDeleteOrReassignRequest: vi.fn(),
		tryAdd: vi.fn().mockReturnValue(null),
		tryUpdate: vi.fn().mockReturnValue(null),
		onAddSuccess: vi.fn(),
		onUpdateSuccess: vi.fn(),
		onDeleteSuccess: vi.fn(),
		mutationError: null,
		handleMutationError: vi.fn(),
		handleDeleteConflict: vi.fn(),
		clearMutationError: vi.fn(),
	};
}

const testIds = DepartmentsCard.testIds;

function renderComponent() {
	render(<DepartmentsCard />);
}

describe('<DepartmentsCard />', () => {
	let mockActionsReturn: UseDepartmentActionsReturn;
	let mockCardReturn: UseEditableAttributeCardReturn;

	beforeEach(() => {
		vi.clearAllMocks();
		mockActionsReturn = buildDefaultActionsReturn();
		mockCardReturn = buildDefaultCardReturn();
		mockUseDepartments.mockReturnValue(defaultDepartmentsReturn);
		mockUseDepartmentActions.mockReturnValue(mockActionsReturn);
		mockUseEditableAttributeCard.mockReturnValue(mockCardReturn);
		vi.mocked(AttributeListItem).mockImplementation(({ item }: AttributeListItemProps) => (
			<li data-testid={`mock-list-item-${item.id}`}>{item.name}</li>
		));
		vi.mocked(ReassignAndDeleteModal).mockImplementation(() => <></>);
	});

	it('renders the card container', () => {
		renderComponent();
		expect(screen.getByTestId(testIds.card)).toBeInTheDocument();
	});

	it('shows a loading message while departments are being fetched', () => {
		mockUseDepartments.mockReturnValue({ ...defaultDepartmentsReturn, isLoading: true });
		renderComponent();
		expect(screen.getByText('Loading departments…')).toBeInTheDocument();
	});

	it('shows an error message when the department fetch fails', () => {
		mockUseDepartments.mockReturnValue({ ...defaultDepartmentsReturn, isError: true });
		renderComponent();
		expect(screen.getByText('Failed to load departments.')).toBeInTheDocument();
	});

	it('renders an AttributeListItem for each department', () => {
		mockUseDepartments.mockReturnValue({ ...defaultDepartmentsReturn, departments: [MOCK_DEPARTMENT] });
		renderComponent();
		expect(screen.getByTestId(`mock-list-item-${MOCK_DEPARTMENT.id}`)).toBeInTheDocument();
		expect(screen.getByText(MOCK_DEPARTMENT.name)).toBeInTheDocument();
	});

	it('has the add button disabled when newName is empty', () => {
		renderComponent();
		expect(screen.getByTestId(testIds.addButton)).toBeDisabled();
	});

	it('calls tryAdd and handleCreateDepartment when the add button is clicked with a valid name', async () => {
		const user = userEvent.setup();
		mockUseEditableAttributeCard.mockReturnValue({
			...mockCardReturn,
			newName: 'Design',
			tryAdd: vi.fn().mockReturnValue({ name: 'Design', color: '#6366f1' }),
		});
		renderComponent();
		await user.click(screen.getByTestId(testIds.addButton));
		expect(mockActionsReturn.handleCreateDepartment).toHaveBeenCalledWith('Design', '#6366f1');
	});

	it('does not call handleCreateDepartment when tryAdd returns null', async () => {
		const user = userEvent.setup();
		mockUseEditableAttributeCard.mockReturnValue({
			...mockCardReturn,
			newName: 'Engineering', // non-empty so button is enabled
			tryAdd: vi.fn().mockReturnValue(null),
		});
		renderComponent();
		await user.click(screen.getByTestId(testIds.addButton));
		expect(mockActionsReturn.handleCreateDepartment).not.toHaveBeenCalled();
	});

	it('passes onAddSuccess, onUpdateSuccess, onDeleteSuccess from the card hook to useDepartmentActions', () => {
		renderComponent();
		expect(mockUseDepartmentActions).toHaveBeenCalledWith(
			expect.objectContaining({
				onCreateSuccess: mockCardReturn.onAddSuccess,
				onUpdateSuccess: mockCardReturn.onUpdateSuccess,
				onDeleteSuccess: mockCardReturn.onDeleteSuccess,
			})
		);
	});

	it('opens the ReassignAndDeleteModal when reassignDeleteState is set', () => {
		mockUseEditableAttributeCard.mockReturnValue({
			...mockCardReturn,
			reassignDeleteState: { id: 1, name: 'Engineering', totalEmployees: 5 },
		});
		renderComponent();
		expect(vi.mocked(ReassignAndDeleteModal)).toHaveBeenCalledWith(
			expect.objectContaining({ isOpen: true }),
			expect.anything()
		);
	});

	it.todo('passes editColor from editingState to AttributeListItem in edit mode');
	it.todo('calls tryUpdate and handleUpdateDepartment when edit is confirmed');
	it.todo('calls handleDeleteDepartment with reassignId when reassign-delete is confirmed');
	it.todo('shows inline error text when card.newNameError is set');
	it.todo('add input Enter key triggers handleAdd');
});
