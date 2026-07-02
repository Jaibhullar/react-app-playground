import { render, screen } from '@testing-library/react';

import { useRoleActions, type UseRoleActionsReturn } from '@/areas/employees/hooks/useRoleActions';
import type { RoleWithCount } from '@/areas/employees/service/roleService';
import { useRoles, type UseRolesReturn } from '@/areas/settings/hooks/useRoles';

import { AttributeListItem, type AttributeListItemProps } from '../AttributeListItem';
import { ReassignAndDeleteModal } from '../ReassignAndDeleteModal';
import { useEditableAttributeCard, type UseEditableAttributeCardReturn } from '../useEditableAttributeCard';
import { RolesCard } from '.';

vi.mock('@/areas/settings/hooks/useRoles');
vi.mock('@/areas/employees/hooks/useRoleActions');
vi.mock('../useEditableAttributeCard');
vi.mock('../AttributeListItem');
vi.mock('../ReassignAndDeleteModal');

const mockUseRoles = vi.mocked(useRoles);
const mockUseRoleActions = vi.mocked(useRoleActions);
const mockUseEditableAttributeCard = vi.mocked(useEditableAttributeCard);

const MOCK_ROLE: RoleWithCount = {
	id: 1,
	name: 'Engineer',
	totalEmployees: 8,
};

const defaultRolesReturn: UseRolesReturn = {
	roles: [],
	isLoading: false,
	isError: false,
};

function buildDefaultActionsReturn(): UseRoleActionsReturn {
	return {
		handleCreateRole: vi.fn(),
		handleUpdateRole: vi.fn(),
		handleDeleteRole: vi.fn(),
		isCreatePending: false,
		isUpdatePending: false,
		isDeletePending: false,
	};
}

function buildDefaultCardReturn(): UseEditableAttributeCardReturn {
	return {
		newName: '',
		newColor: '',
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

const testIds = RolesCard.testIds;

function renderComponent() {
	render(<RolesCard />);
}

describe('<RolesCard />', () => {
	let mockActionsReturn: UseRoleActionsReturn;
	let mockCardReturn: UseEditableAttributeCardReturn;

	beforeEach(() => {
		vi.clearAllMocks();
		mockActionsReturn = buildDefaultActionsReturn();
		mockCardReturn = buildDefaultCardReturn();
		mockUseRoles.mockReturnValue(defaultRolesReturn);
		mockUseRoleActions.mockReturnValue(mockActionsReturn);
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

	it('shows a loading message while roles are being fetched', () => {
		mockUseRoles.mockReturnValue({ ...defaultRolesReturn, isLoading: true });
		renderComponent();
		expect(screen.getByText('Loading roles…')).toBeInTheDocument();
	});

	it('shows an error message when the role fetch fails', () => {
		mockUseRoles.mockReturnValue({ ...defaultRolesReturn, isError: true });
		renderComponent();
		expect(screen.getByText('Failed to load roles.')).toBeInTheDocument();
	});

	it('renders an AttributeListItem for each role', () => {
		mockUseRoles.mockReturnValue({ ...defaultRolesReturn, roles: [MOCK_ROLE] });
		renderComponent();
		expect(screen.getByTestId(`mock-list-item-${MOCK_ROLE.id}`)).toBeInTheDocument();
	});

	it.todo('has the add button disabled when newName is empty');
	it.todo('calls tryAdd and handleCreateRole when the add button is clicked with a valid name');
	it.todo('does not call handleCreateRole when tryAdd returns null');
	it.todo('passes onAddSuccess, onUpdateSuccess, onDeleteSuccess to useRoleActions');
	it.todo('calls tryUpdate and handleUpdateRole when edit is confirmed');
	it.todo('calls handleDeleteRole with reassignId when reassign-delete is confirmed');
	it.todo('opens the ReassignAndDeleteModal when reassignDeleteState is set');
	it.todo('shows inline error text when card.newNameError is set');
});
