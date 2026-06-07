import { useCallback, useState } from 'react';

import type { Employee, EmployeeFormValues, GetEmployeeFiltersResponse } from '../../types';

export type EmployeeFormProps = {
	drawerMode: 'create' | 'edit',
	employee?: Employee,
	filterOptions: GetEmployeeFiltersResponse,
	isSubmitting: boolean,
	onSubmit: (values: EmployeeFormValues) => void,
	onCancel: () => void,
};

const testIds = {
	form: 'employee-form',
	nameInput: 'employee-form-name-input',
	departmentSelect: 'employee-form-department-select',
	locationSelect: 'employee-form-location-select',
	roleSelect: 'employee-form-role-select',
	submitButton: 'employee-form-submit-button',
	cancelButton: 'employee-form-cancel-button',
};

const FIELD_LABELS = {
	name: 'Name',
	department: 'Department',
	location: 'Location',
	role: 'Role',
} as const;

const resolveInitialValues = (employee: Employee | undefined): EmployeeFormValues => ({
	name: employee?.name ?? '',
	departmentId: employee?.department.id ?? 0,
	locationId: employee?.location.id ?? 0,
	roleId: employee?.role.id ?? 0,
});

export const EmployeeForm = ({
	drawerMode,
	employee,
	filterOptions,
	isSubmitting,
	onSubmit,
	onCancel,
}: EmployeeFormProps) => {
	const [values, setValues] = useState<EmployeeFormValues>(() => resolveInitialValues(employee));

	const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setValues(prev => ({ ...prev, name: event.target.value }));
	}, []);

	const handleDepartmentChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
		setValues(prev => ({ ...prev, departmentId: Number(event.target.value) }));
	}, []);

	const handleLocationChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
		setValues(prev => ({ ...prev, locationId: Number(event.target.value) }));
	}, []);

	const handleRoleChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
		setValues(prev => ({ ...prev, roleId: Number(event.target.value) }));
	}, []);

	const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSubmit(values);
	}, [onSubmit, values]);

	const submitLabel = drawerMode === 'create' ? 'Create employee' : 'Save changes';

	return (
		<form data-testid={testIds.form} onSubmit={handleSubmit}>
			<div>
				<label htmlFor={testIds.nameInput}>{FIELD_LABELS.name}</label>
				<input
					id={testIds.nameInput}
					data-testid={testIds.nameInput}
					type="text"
					value={values.name}
					onChange={handleNameChange}
					required
				/>
			</div>

			<div>
				<label htmlFor={testIds.departmentSelect}>{FIELD_LABELS.department}</label>
				<select
					id={testIds.departmentSelect}
					data-testid={testIds.departmentSelect}
					value={values.departmentId}
					onChange={handleDepartmentChange}
					required
				>
					<option value={0} disabled>Select a department</option>
					{filterOptions.departments.map(dept => (
						<option key={dept.id} value={dept.id}>{dept.name}</option>
					))}
				</select>
			</div>

			<div>
				<label htmlFor={testIds.locationSelect}>{FIELD_LABELS.location}</label>
				<select
					id={testIds.locationSelect}
					data-testid={testIds.locationSelect}
					value={values.locationId}
					onChange={handleLocationChange}
					required
				>
					<option value={0} disabled>Select a location</option>
					{filterOptions.locations.map(loc => (
						<option key={loc.id} value={loc.id}>{loc.name}</option>
					))}
				</select>
			</div>

			<div>
				<label htmlFor={testIds.roleSelect}>{FIELD_LABELS.role}</label>
				<select
					id={testIds.roleSelect}
					data-testid={testIds.roleSelect}
					value={values.roleId}
					onChange={handleRoleChange}
					required
				>
					<option value={0} disabled>Select a role</option>
					{filterOptions.roles.map(role => (
						<option key={role.id} value={role.id}>{role.name}</option>
					))}
				</select>
			</div>

			<button
				type="button"
				data-testid={testIds.cancelButton}
				onClick={onCancel}
				disabled={isSubmitting}
			>
				Cancel
			</button>
			<button
				type="submit"
				data-testid={testIds.submitButton}
				disabled={isSubmitting}
			>
				{isSubmitting ? 'Saving...' : submitLabel}
			</button>
		</form>
	);
};

EmployeeForm.testIds = testIds;
