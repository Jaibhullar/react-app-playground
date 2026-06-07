import { Calendar, ChevronRight, Mail, MapPin, Phone, Users } from 'lucide-react';

import { Badge } from '@/common/components/ui/Badge';
import { Modal } from '@/common/components/ui/Modal';

import { useEmployeeDetail } from '../../hooks/useEmployeeDetail';
import type { Employee } from '../../types';
import { getDepartmentBadgeStyle, getInitials } from '../../utils/employeeDisplayUtils';

import css from './ViewProfileModal.module.scss';

const testIds = {
	hierarchyPerson: (employeeId: number) => `view-profile-hierarchy-person-${employeeId}`,
};

export type ViewProfileModalProps = {
	employeeId: number | null,
	onClose: () => void,
	onEmployeeSelect: (employeeId: number) => void,
};

/** Formats an ISO date string (e.g. '2020-06-01') as a human-readable date (e.g. '1 June 2020'). */
function formatStartDate(isoDateString: string): string {
	return new Date(isoDateString).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
}

type HierarchyPersonButtonProps = {
	employee: Employee,
	onSelect: (employeeId: number) => void,
	showChevron?: boolean,
};

const HierarchyPersonButton = ({ employee, onSelect, showChevron = false }: HierarchyPersonButtonProps) => (
	<button
		type="button"
		data-testid={testIds.hierarchyPerson(employee.id)}
		className={css.hierarchyPersonButton}
		onClick={() => onSelect(employee.id)}
		aria-label={`View profile for ${employee.name}`}
	>
		<div className={css.personAvatar} aria-hidden="true">
			{getInitials(employee.name)}
		</div>
		<div className={css.personInfo}>
			<p className={css.personName}>{employee.name}</p>
			<p className={css.personRole}>{employee.role.name}</p>
		</div>
		{showChevron && (
			<span className={css.chevron} aria-hidden="true">
				<ChevronRight />
			</span>
		)}
	</button>
);

export const ViewProfileModal = ({ employeeId, onClose, onEmployeeSelect }: ViewProfileModalProps) => {
	const isOpen = employeeId !== null;
	const { employeeDetail, isLoading, isError } = useEmployeeDetail({ employeeId });

	const bodyContent = (() => {
		if (isLoading) return <p className={css.statusMessage}>Loading…</p>;
		if (isError) return <p className={css.statusMessage}>Failed to load employee details.</p>;
		if (!employeeDetail) return null;

		const { name, role, department, location, email, phone, startDate, hierarchy } = employeeDetail;
		const badgeStyle = getDepartmentBadgeStyle(department);
		const totalDirectReports = hierarchy.subordinates.length;

		return (
			<>
				<div className={css.profileHeader}>
					<div className={css.avatar} aria-hidden="true">
						{getInitials(name)}
					</div>
					<p className={css.roleTitle}>{role.name}</p>
					<div className={css.metaRow}>
						<Badge style={{ backgroundColor: badgeStyle.backgroundColor, color: badgeStyle.color, border: 'none' }}>
							{department.name}
						</Badge>
						<span className={css.location}>
							<MapPin aria-hidden="true" />
							{location.name}
						</span>
					</div>
				</div>

				<hr className={css.divider} />

				<section className={css.section}>
					<h3 className={css.sectionTitle}>Contact Information</h3>
					<div className={css.contactGrid}>
						<div className={css.contactTile}>
							<div className={css.contactIcon}><Mail aria-hidden="true" /></div>
							<div className={css.contactInfo}>
								<p className={css.contactLabel}>Email</p>
								<p className={css.contactValue}>{email}</p>
							</div>
						</div>
						<div className={css.contactTile}>
							<div className={css.contactIcon}><Phone aria-hidden="true" /></div>
							<div className={css.contactInfo}>
								<p className={css.contactLabel}>Phone</p>
								<p className={css.contactValue}>{phone}</p>
							</div>
						</div>
						<div className={[css.contactTile, css.contactTileFull].join(' ')}>
							<div className={css.contactIcon}><Calendar aria-hidden="true" /></div>
							<div className={css.contactInfo}>
								<p className={css.contactLabel}>Start Date</p>
								<p className={css.contactValue}>{formatStartDate(startDate)}</p>
							</div>
						</div>
					</div>
				</section>

				{hierarchy.managers.length > 0 && (
					<>
						<hr className={css.divider} />
						<section className={css.section}>
							<h3 className={css.sectionTitle}>Reports To</h3>
							<div className={css.managersColumn}>
								{hierarchy.managers.map((manager) => (
									<HierarchyPersonButton
										key={manager.id}
										employee={manager}
										onSelect={onEmployeeSelect}
										showChevron
									/>
								))}
							</div>
						</section>
					</>
				)}

				{hierarchy.subordinates.length > 0 && (
					<>
						<hr className={css.divider} />
						<section className={css.section}>
							<h3 className={css.sectionTitle}>
								<Users aria-hidden="true" />
								{`Direct Reports (${totalDirectReports})`}
							</h3>
							<div className={css.directReportsGrid}>
								{hierarchy.subordinates.map((report) => (
									<HierarchyPersonButton
										key={report.id}
										employee={report}
										onSelect={onEmployeeSelect}
									/>
								))}
							</div>
						</section>
					</>
				)}
			</>
		);
	})();

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={employeeDetail?.name ?? 'Employee Profile'}
			size="lg"
		>
			{bodyContent}
		</Modal>
	);
};

ViewProfileModal.testIds = testIds;
