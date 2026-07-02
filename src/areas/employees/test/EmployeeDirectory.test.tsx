import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AddEmployeeModal, type AddEmployeeModalProps } from '../components/AddEmployeeModal';
import { ViewProfileModal } from '../components/ViewProfileModal';
import { EmployeeDirectory } from '../EmployeeDirectory';
import { useEmployeeDirectory, type UseEmployeeDirectoryReturn } from '../hooks/useEmployeeDirectory';
import { useEmployeeDirectoryFilters, type UseEmployeeDirectoryFiltersReturn } from '../hooks/useEmployeeDirectoryFilters';
import type { Employee } from '../types';

vi.mock('../hooks/useEmployeeDirectory');
vi.mock('../hooks/useEmployeeDirectoryFilters');
vi.mock('../components/AddEmployeeModal');
vi.mock('../components/ViewProfileModal');

const mockUseEmployeeDirectory = vi.mocked(useEmployeeDirectory);
const mockUseEmployeeDirectoryFilters = vi.mocked(useEmployeeDirectoryFilters);

const MOCK_EMPLOYEE: Employee = {
	id: 1,
	name: 'Alice Smith',
	department: { id: 1, name: 'Engineering', color: '#6366f1' },
	location: { id: 1, name: 'London' },
	role: { id: 1, name: 'Software Engineer' },
};

const defaultDirectoryReturn: UseEmployeeDirectoryReturn = {
	employees: [],
	totalEmployees: 0,
	currentPage: 1,
	totalPages: 1,
	isLoading: false,
	isError: false,
	handlePageChange: vi.fn(),
};

const defaultFiltersReturn: UseEmployeeDirectoryFiltersReturn = {
	searchQuery: '',
	selectedDepartmentId: 'all',
	selectedLocationId: 'all',
	departmentOptions: [{ value: 'all', label: 'All Departments' }],
	locationOptions: [{ value: 'all', label: 'All Locations' }],
	handleSearchChange: vi.fn(),
	handleDepartmentChange: vi.fn(),
	handleLocationChange: vi.fn(),
};

const MOCK_ADD_MODAL_TEST_ID = 'mock-add-employee-modal';

const testIds = EmployeeDirectory.testIds;

function renderComponent() {
	render(<EmployeeDirectory />);
}

describe('<EmployeeDirectory />', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseEmployeeDirectory.mockReturnValue({ ...defaultDirectoryReturn });
		mockUseEmployeeDirectoryFilters.mockReturnValue({ ...defaultFiltersReturn });
		vi.mocked(AddEmployeeModal).mockImplementation(({ isOpen }: AddEmployeeModalProps) =>
			isOpen ? <div data-testid={MOCK_ADD_MODAL_TEST_ID} /> : null
		);
		vi.mocked(ViewProfileModal).mockImplementation(() => null);
	});

	it('renders the page container', () => {
		renderComponent();
		expect(screen.getByTestId(testIds.page)).toBeInTheDocument();
	});

	it('shows a loading message while employees are being fetched', () => {
		mockUseEmployeeDirectory.mockReturnValue({ ...defaultDirectoryReturn, isLoading: true });
		renderComponent();
		expect(screen.getByText('Loading employees…')).toBeInTheDocument();
	});

	it('shows an error message when the employee fetch fails', () => {
		mockUseEmployeeDirectory.mockReturnValue({ ...defaultDirectoryReturn, isError: true });
		renderComponent();
		expect(screen.getByText('Failed to load employees.')).toBeInTheDocument();
	});

	it('shows an empty-state message when no employees match', () => {
		renderComponent();
		expect(screen.getByText('No employees found.')).toBeInTheDocument();
	});

	it('renders an employee name for each employee returned', () => {
		mockUseEmployeeDirectory.mockReturnValue({ ...defaultDirectoryReturn, employees: [MOCK_EMPLOYEE] });
		renderComponent();
		expect(screen.getByText(MOCK_EMPLOYEE.name)).toBeInTheDocument();
	});

	it('opens AddEmployeeModal when the "Add Employee" button is clicked', async () => {
		const user = userEvent.setup();
		renderComponent();
		expect(screen.queryByTestId(MOCK_ADD_MODAL_TEST_ID)).not.toBeInTheDocument();
		await user.click(screen.getByTestId(testIds.addEmployeeButton));
		expect(screen.getByTestId(MOCK_ADD_MODAL_TEST_ID)).toBeInTheDocument();
	});

	it('calls handleSearchChange when typing in the search input', async () => {
		const user = userEvent.setup();
		renderComponent();
		await user.type(screen.getByTestId(testIds.searchInput), 'A');
		expect(defaultFiltersReturn.handleSearchChange).toHaveBeenCalledWith('A');
	});

	it('calls handleDepartmentChange when the department filter changes', async () => {
		const user = userEvent.setup();
		mockUseEmployeeDirectoryFilters.mockReturnValue({
			...defaultFiltersReturn,
			departmentOptions: [
				{ value: 'all', label: 'All Departments' },
				{ value: '1', label: 'Engineering' },
			],
		});
		renderComponent();
		await user.selectOptions(screen.getByTestId(testIds.departmentSelect), '1');
		expect(defaultFiltersReturn.handleDepartmentChange).toHaveBeenCalledWith('1');
	});

	it('calls handleLocationChange when the location filter changes', async () => {
		const user = userEvent.setup();
		mockUseEmployeeDirectoryFilters.mockReturnValue({
			...defaultFiltersReturn,
			locationOptions: [
				{ value: 'all', label: 'All Locations' },
				{ value: '2', label: 'Manchester' },
			],
		});
		renderComponent();
		await user.selectOptions(screen.getByTestId(testIds.locationSelect), '2');
		expect(defaultFiltersReturn.handleLocationChange).toHaveBeenCalledWith('2');
	});

	it.todo('closes AddEmployeeModal when onClose is called from the modal');
	it.todo('closes AddEmployeeModal and triggers refresh when onEmployeeCreated is called');
	it.todo('opens ViewProfileModal when "View Profile" is clicked on an employee card');
	it.todo('does not render the paginator while loading');
	it.todo('renders the paginator when totalPages is greater than 1');
});
