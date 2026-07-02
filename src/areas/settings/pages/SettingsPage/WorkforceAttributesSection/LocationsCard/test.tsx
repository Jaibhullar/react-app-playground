import { render, screen } from '@testing-library/react';

import { useLocationActions, type UseLocationActionsReturn } from '@/areas/employees/hooks/useLocationActions';
import type { LocationWithCount } from '@/areas/employees/service/locationService';
import { useLocations, type UseLocationsReturn } from '@/areas/settings/hooks/useLocations';

import { AttributeListItem, type AttributeListItemProps } from '../AttributeListItem';
import { ReassignAndDeleteModal } from '../ReassignAndDeleteModal';
import { useEditableAttributeCard, type UseEditableAttributeCardReturn } from '../useEditableAttributeCard';
import { LocationsCard } from '.';

vi.mock('@/areas/settings/hooks/useLocations');
vi.mock('@/areas/employees/hooks/useLocationActions');
vi.mock('../useEditableAttributeCard');
vi.mock('../AttributeListItem');
vi.mock('../ReassignAndDeleteModal');

const mockUseLocations = vi.mocked(useLocations);
const mockUseLocationActions = vi.mocked(useLocationActions);
const mockUseEditableAttributeCard = vi.mocked(useEditableAttributeCard);

const MOCK_LOCATION: LocationWithCount = {
	id: 1,
	name: 'London',
	totalEmployees: 3,
};

const defaultLocationsReturn: UseLocationsReturn = {
	locations: [],
	isLoading: false,
	isError: false,
};

function buildDefaultActionsReturn(): UseLocationActionsReturn {
	return {
		handleCreateLocation: vi.fn(),
		handleUpdateLocation: vi.fn(),
		handleDeleteLocation: vi.fn(),
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
	};
}

const testIds = LocationsCard.testIds;

function renderComponent() {
	render(<LocationsCard />);
}

describe('<LocationsCard />', () => {
	let mockActionsReturn: UseLocationActionsReturn;
	let mockCardReturn: UseEditableAttributeCardReturn;

	beforeEach(() => {
		vi.clearAllMocks();
		mockActionsReturn = buildDefaultActionsReturn();
		mockCardReturn = buildDefaultCardReturn();
		mockUseLocations.mockReturnValue(defaultLocationsReturn);
		mockUseLocationActions.mockReturnValue(mockActionsReturn);
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

	it('shows a loading message while locations are being fetched', () => {
		mockUseLocations.mockReturnValue({ ...defaultLocationsReturn, isLoading: true });
		renderComponent();
		expect(screen.getByText('Loading locations…')).toBeInTheDocument();
	});

	it('shows an error message when the location fetch fails', () => {
		mockUseLocations.mockReturnValue({ ...defaultLocationsReturn, isError: true });
		renderComponent();
		expect(screen.getByText('Failed to load locations.')).toBeInTheDocument();
	});

	it('renders an AttributeListItem for each location', () => {
		mockUseLocations.mockReturnValue({ ...defaultLocationsReturn, locations: [MOCK_LOCATION] });
		renderComponent();
		expect(screen.getByTestId(`mock-list-item-${MOCK_LOCATION.id}`)).toBeInTheDocument();
	});

	it.todo('has the add button disabled when newName is empty');
	it.todo('calls tryAdd and handleCreateLocation when the add button is clicked with a valid name');
	it.todo('does not call handleCreateLocation when tryAdd returns null');
	it.todo('passes onAddSuccess, onUpdateSuccess, onDeleteSuccess to useLocationActions');
	it.todo('calls tryUpdate and handleUpdateLocation when edit is confirmed');
	it.todo('calls handleDeleteLocation with reassignId when reassign-delete is confirmed');
	it.todo('opens the ReassignAndDeleteModal when reassignDeleteState is set');
	it.todo('shows inline error text when card.newNameError is set');
});
