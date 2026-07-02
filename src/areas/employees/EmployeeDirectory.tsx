import { useCallback, useState } from 'react';
import { MapPin, Search, UserPlus } from 'lucide-react';

import { Badge } from '@/common/components/ui/Badge';
import { Button } from '@/common/components/ui/Button';
import { Paginator } from '@/common/components/ui/Paginator';
import { Select } from '@/common/components/ui/Select';

import { AddEmployeeModal } from './components/AddEmployeeModal';
import { ViewProfileModal } from './components/ViewProfileModal';
import { useEmployeeDirectory } from './hooks/useEmployeeDirectory';
import { useEmployeeDirectoryFilters } from './hooks/useEmployeeDirectoryFilters';
import { getDepartmentBadgeStyle, getInitials } from './utils/employeeDisplayUtils';
import type { Employee } from './types';

import css from './EmployeeDirectory.module.scss';

type EmployeeCardProps = {
	employee: Employee,
	onViewProfile: (employeeId: number) => void,
};

const testIds = {
	page: 'employee-directory',
	addEmployeeButton: 'add-employee-button',
	searchInput: 'employee-search-input',
	departmentSelect: 'employee-department-select',
	locationSelect: 'employee-location-select',
	paginator: Paginator.testIds.nav,
	employeeCard: (id: number) => `employee-card-${id}`,
	viewProfileButton: (id: number) => `employee-card-view-profile-${id}`,
};

const EmployeeCard = ({ employee, onViewProfile }: EmployeeCardProps) => {
	const badgeStyle = getDepartmentBadgeStyle(employee.department);
	const handleViewProfileClick = () => onViewProfile(employee.id);

	return (
		<div className={css.card} data-testid={testIds.employeeCard(employee.id)}>
			<div className={css.avatar} aria-hidden="true">
				{getInitials(employee.name)}
			</div>
			<p className={css.cardName}>{employee.name}</p>
			<p className={css.cardRole}>{employee.role.name}</p>
			<Badge style={{ backgroundColor: badgeStyle.backgroundColor, color: badgeStyle.color, border: 'none' }}>
				{employee.department.name}
			</Badge>
			<p className={css.cardLocation}>
				<MapPin aria-hidden="true" />
				{employee.location.name}
			</p>
			<div className={css.cardFooter}>
				<Button
					variant="outline"
					className={css.viewProfileButton}
					data-testid={testIds.viewProfileButton(employee.id)}
					onClick={handleViewProfileClick}
				>
					View Profile
				</Button>
			</div>
		</div>
	);
};

type AddEmployeeModalState = {
	mode: 'add',
} | null;

export const EmployeeDirectory = () => {
	const [addEmployeeModalState, setAddEmployeeModalState] = useState<AddEmployeeModalState>(null);
	const isAddEmployeeModalOpen = !!addEmployeeModalState;

	const [viewProfileEmployeeId, setViewProfileEmployeeId] = useState<number | null>(null);

	const {
		searchQuery,
		selectedDepartmentId,
		selectedLocationId,
		departmentOptions,
		locationOptions,
		handleSearchChange,
		handleDepartmentChange,
		handleLocationChange,
	} = useEmployeeDirectoryFilters();

	const {
		employees,
		currentPage,
		totalPages,
		isLoading,
		isError,
		handlePageChange,
	} = useEmployeeDirectory({
		searchQuery,
		departmentId: selectedDepartmentId,
		locationId: selectedLocationId,
	});

	const handleOpenAddModal = useCallback(() => {
		setAddEmployeeModalState({ mode: 'add' });
	}, []);

	const handleAddModalClose = useCallback(() => {
		setAddEmployeeModalState(null);
	}, []);

	const handleEmployeeCreated = useCallback(() => {
		setAddEmployeeModalState(null);
	}, []);

	const handleViewProfileClose = useCallback(() => {
		setViewProfileEmployeeId(null);
	}, []);

	const handleSearchInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value),
		[handleSearchChange]
	);

	const handleDepartmentSelectChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => handleDepartmentChange(e.target.value),
		[handleDepartmentChange]
	);

	const handleLocationSelectChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => handleLocationChange(e.target.value),
		[handleLocationChange]
	);

	const gridContent = (() => {
		if (isLoading) return <p className={css.statusMessage}>Loading employees…</p>;
		if (isError) return <p className={css.statusMessage}>Failed to load employees.</p>;
		if (employees.length === 0) return <p className={css.statusMessage}>No employees found.</p>;
		return (
			<div className={css.grid}>
				{employees.map((employee) => (
					<EmployeeCard key={employee.id} employee={employee} onViewProfile={setViewProfileEmployeeId} />
				))}
			</div>
		);
	})();

	return (
		<>
			<div className={css.page} data-testid={testIds.page}>
				<header className={css.header}>
					<h1 className={css.title}>Employee Directory</h1>
					<Button
						data-testid={testIds.addEmployeeButton}
						onClick={handleOpenAddModal}
					>
						<UserPlus />
						Add Employee
					</Button>
				</header>

				<div className={css.filters}>
					<div className={css.searchWrapper}>
						<Search className={css.searchIcon} aria-hidden="true" />
						<input
							data-testid={testIds.searchInput}
							className={css.searchInput}
							type="search"
							placeholder="Search by name or role…"
							value={searchQuery}
							onChange={handleSearchInputChange}
						/>
					</div>

					<div className={css.selectsRow}>
						<Select
							data-testid={testIds.departmentSelect}
							options={departmentOptions}
							value={selectedDepartmentId}
							onChange={handleDepartmentSelectChange}
						/>
						<Select
							data-testid={testIds.locationSelect}
							options={locationOptions}
							value={selectedLocationId}
							onChange={handleLocationSelectChange}
						/>
					</div>
				</div>

				{gridContent}
				{!isLoading && !isError && (
					<Paginator
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				)}
			</div>

			<AddEmployeeModal
				isOpen={isAddEmployeeModalOpen}
				onClose={handleAddModalClose}
				onEmployeeCreated={handleEmployeeCreated}
			/>

			<ViewProfileModal
				isOpen={viewProfileEmployeeId !== null}
				employeeId={viewProfileEmployeeId}
				onClose={handleViewProfileClose}
				onEmployeeSelect={setViewProfileEmployeeId}
			/>
		</>
	);
};

EmployeeDirectory.testIds = testIds;
