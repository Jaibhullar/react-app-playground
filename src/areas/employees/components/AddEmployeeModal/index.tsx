import { useCallback, useMemo, useState } from 'react';

import { useDepartments } from '@/areas/settings/hooks/useDepartments';
import { useLocations } from '@/areas/settings/hooks/useLocations';
import { useRoles } from '@/areas/settings/hooks/useRoles';
import { Button } from '@/common/components/ui/Button';
import { Modal } from '@/common/components/ui/Modal';
import { Select } from '@/common/components/ui/Select';

import { useEmployeeActions } from '../../hooks/useEmployeeActions';

import css from './AddEmployeeModal.module.scss';

type AddEmployeeFormValues = {
	firstName: string,
	lastName: string,
	roleId: string,
	departmentId: string,
	locationId: string,
};

const INITIAL_FORM_VALUES: AddEmployeeFormValues = {
	firstName: '',
	lastName: '',
	roleId: '',
	departmentId: '',
	locationId: '',
};

export type AddEmployeeModalProps = {
	isOpen: boolean,
	onClose: () => void,
	onEmployeeCreated: () => void,
};

const testIds = {
	firstNameInput: 'add-employee-first-name',
	lastNameInput: 'add-employee-last-name',
	roleSelect: 'add-employee-role-select',
	departmentSelect: 'add-employee-department-select',
	locationSelect: 'add-employee-location-select',
	cancelButton: 'add-employee-cancel-button',
	submitButton: 'add-employee-submit-button',
};

export const AddEmployeeModal = ({ isOpen, onClose, onEmployeeCreated }: AddEmployeeModalProps) => {
	const [formValues, setFormValues] = useState<AddEmployeeFormValues>(INITIAL_FORM_VALUES);

	const { departments } = useDepartments();
	const { locations } = useLocations();
	const { roles } = useRoles();

	const { handleCreateEmployee, isCreatePending } = useEmployeeActions({
		onCreateSuccess: () => {
			setFormValues(INITIAL_FORM_VALUES);
			onEmployeeCreated();
		},
	});

	const roleOptions = useMemo(
		() => [
			{ value: '', label: 'Select a role', disabled: true },
			...roles.map((r) => ({ value: String(r.id), label: r.name })),
		],
		[roles]
	);

	const departmentOptions = useMemo(
		() => [
			{ value: '', label: 'Select a department', disabled: true },
			...departments.map((d) => ({ value: String(d.id), label: d.name })),
		],
		[departments]
	);

	const locationOptions = useMemo(
		() => [
			{ value: '', label: 'Select a location', disabled: true },
			...locations.map((l) => ({ value: String(l.id), label: l.name })),
		],
		[locations]
	);

	const isFormValid =
		formValues.firstName.trim() !== '' &&
		formValues.lastName.trim() !== '' &&
		formValues.roleId !== '' &&
		formValues.departmentId !== '' &&
		formValues.locationId !== '';

	const handleFirstNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setFormValues((prev) => ({ ...prev, firstName: e.target.value }));
	}, []);

	const handleLastNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setFormValues((prev) => ({ ...prev, lastName: e.target.value }));
	}, []);

	const handleRoleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
		setFormValues((prev) => ({ ...prev, roleId: e.target.value }));
	}, []);

	const handleDepartmentChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
		setFormValues((prev) => ({ ...prev, departmentId: e.target.value }));
	}, []);

	const handleLocationChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
		setFormValues((prev) => ({ ...prev, locationId: e.target.value }));
	}, []);

	const handleClose = useCallback(() => {
		setFormValues(INITIAL_FORM_VALUES);
		onClose();
	}, [onClose]);

	const handleSubmit = useCallback(() => {
		if (!isFormValid) return;
		handleCreateEmployee({
			name: `${formValues.firstName.trim()} ${formValues.lastName.trim()}`,
			departmentId: Number(formValues.departmentId),
			locationId: Number(formValues.locationId),
			roleId: Number(formValues.roleId),
		});
	}, [formValues, handleCreateEmployee, isFormValid]);

	const footer = (
		<>
			<Button
				data-testid={testIds.cancelButton}
				variant="outline"
				onClick={handleClose}
				disabled={isCreatePending}
			>
				Cancel
			</Button>
			<Button
				data-testid={testIds.submitButton}
				onClick={handleSubmit}
				disabled={!isFormValid || isCreatePending}
			>
				{isCreatePending ? 'Adding…' : 'Add Employee'}
			</Button>
		</>
	);

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title="Add New Employee"
			footer={footer}
		>
			<div className={css.form}>
				<div className={css.nameRow}>
					<div className={css.field}>
						<label className={css.label} htmlFor="firstName">
							First Name
						</label>
						<input
							id="firstName"
							data-testid={testIds.firstNameInput}
							className={css.input}
							type="text"
							placeholder="John"
							value={formValues.firstName}
							onChange={handleFirstNameChange}
						/>
					</div>
					<div className={css.field}>
						<label className={css.label} htmlFor="lastName">
							Last Name
						</label>
						<input
							id="lastName"
							data-testid={testIds.lastNameInput}
							className={css.input}
							type="text"
							placeholder="Doe"
							value={formValues.lastName}
							onChange={handleLastNameChange}
						/>
					</div>
				</div>

				<div className={css.field}>
					<label className={css.label} htmlFor="role">
						Job Title
					</label>
					<Select
						id="role"
						data-testid={testIds.roleSelect}
						options={roleOptions}
						value={formValues.roleId}
						onChange={handleRoleChange}
					/>
				</div>

				<div className={css.nameRow}>
					<div className={css.field}>
						<label className={css.label} htmlFor="department">
							Department
						</label>
						<Select
							id="department"
							data-testid={testIds.departmentSelect}
							options={departmentOptions}
							value={formValues.departmentId}
							onChange={handleDepartmentChange}
						/>
					</div>
					<div className={css.field}>
						<label className={css.label} htmlFor="location">
							Location
						</label>
						<Select
							id="location"
							data-testid={testIds.locationSelect}
							options={locationOptions}
							value={formValues.locationId}
							onChange={handleLocationChange}
						/>
					</div>
				</div>
			</div>
		</Modal>
	);
};

AddEmployeeModal.testIds = testIds;
