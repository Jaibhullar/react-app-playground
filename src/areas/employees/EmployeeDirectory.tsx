import { useState } from 'react';
import { MapPin, Search, UserPlus } from 'lucide-react';

import { Badge } from '@/common/components/ui/Badge';
import { Button } from '@/common/components/ui/Button';
import { Select } from '@/common/components/ui/Select';

import { AddEmployeeModal } from './components/AddEmployeeModal';
import { useEmployeeDirectory } from './hooks/useEmployeeDirectory';
import type { Department, Employee } from './types';

import css from './EmployeeDirectory.module.scss';

// Fallback palette used only when a department has no color set.
const DEPARTMENT_BADGE_FALLBACK_COLORS = [
	{ backgroundColor: '#fce7f3', color: '#9d174d' }, // pink
	{ backgroundColor: '#fef9c3', color: '#854d0e' }, // yellow
	{ backgroundColor: '#dcfce7', color: '#14532d' }, // green
	{ backgroundColor: '#e0f2fe', color: '#0c4a6e' }, // sky
	{ backgroundColor: '#fff7ed', color: '#7c2d12' }, // orange
	{ backgroundColor: '#f3e8ff', color: '#581c87' }, // purple
] as const;

function getInitials(name: string): string {
	return name
		.split(' ')
		.slice(0, 2)
		.map((part) => part[0] ?? '')
		.join('')
		.toUpperCase();
}

function getDepartmentBadgeStyle(department: Department) {
	if (department.color) {
		return {
			backgroundColor: `${department.color}33`,
			color: department.color,
		};
	}
	return DEPARTMENT_BADGE_FALLBACK_COLORS[department.id % DEPARTMENT_BADGE_FALLBACK_COLORS.length];
}

type EmployeeCardProps = {
	employee: Employee,
};

const EmployeeCard = ({ employee }: EmployeeCardProps) => {
	const badgeStyle = getDepartmentBadgeStyle(employee.department);

	return (
		<div className={css.card}>
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
				<Button variant="outline" className={css.viewProfileButton}>
					View Profile
				</Button>
			</div>
		</div>
	);
};

const testIds = {
	page: 'employee-directory',
	addEmployeeButton: 'add-employee-button',
	searchInput: 'employee-search-input',
	departmentSelect: 'employee-department-select',
	locationSelect: 'employee-location-select',
};

type AddEmployeeModalState = {
	mode: 'add',
} | null;

export const EmployeeDirectory = () => {
	const [addEmployeeModalState, setAddEmployeeModalState] = useState<AddEmployeeModalState>(null);
	const isAddEmployeeModalOpen = !!addEmployeeModalState;

	const {
		employees,
		isLoading,
		isError,
		searchQuery,
		selectedDepartmentId,
		selectedLocationId,
		handleSearchChange,
		handleDepartmentChange,
		handleLocationChange,
		departmentOptions,
		locationOptions,
	} = useEmployeeDirectory();

	const gridContent = (() => {
		if (isLoading) return <p className={css.statusMessage}>Loading employees…</p>;
		if (isError) return <p className={css.statusMessage}>Failed to load employees.</p>;
		if (employees.length === 0) return <p className={css.statusMessage}>No employees found.</p>;
		return (
			<div className={css.grid}>
				{employees.map((employee) => (
					<EmployeeCard key={employee.id} employee={employee} />
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
						onClick={() => setAddEmployeeModalState({ mode: 'add' })}
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
							onChange={(e) => handleSearchChange(e.target.value)}
						/>
					</div>

					<div className={css.selectsRow}>
						<Select
							data-testid={testIds.departmentSelect}
							options={departmentOptions}
							value={selectedDepartmentId}
							onChange={(e) => handleDepartmentChange(e.target.value)}
						/>
						<Select
							data-testid={testIds.locationSelect}
							options={locationOptions}
							value={selectedLocationId}
							onChange={(e) => handleLocationChange(e.target.value)}
						/>
					</div>
				</div>

				{gridContent}
			</div>

			<AddEmployeeModal
				isOpen={isAddEmployeeModalOpen}
				onClose={() => setAddEmployeeModalState(null)}
				onEmployeeCreated={() => setAddEmployeeModalState(null)}
			/>
		</>
	);
};

EmployeeDirectory.testIds = testIds;
