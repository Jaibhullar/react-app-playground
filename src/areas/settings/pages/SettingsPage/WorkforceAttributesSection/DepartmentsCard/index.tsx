import { useCallback, useMemo, useState } from 'react';
import { Building2, Plus } from 'lucide-react';

import { useDepartmentActions } from '@/areas/employees/hooks/useDepartmentActions';
import type { DepartmentWithCount } from '@/areas/employees/service/departmentService';
import { useDepartments } from '@/areas/settings/hooks/useDepartments';
import { Button } from '@/common/components/ui/Button';

import { ReassignAndDeleteModal } from '../ReassignAndDeleteModal';
import { DepartmentListItem } from './DepartmentListItem';

import css from './DepartmentsCard.module.scss';

const DUPLICATE_NAME_ERROR = 'A department with this name already exists' as const;
const DEFAULT_DEPARTMENT_COLOR = '#6366f1' as const;

type EditingState = {
	departmentId: number,
	editValue: string,
	editColor: string,
	nameError: string | null,
} | null;

type ReassignDeleteState = {
	id: number,
	name: string,
	totalEmployees: number,
} | null;

function isDuplicateName(name: string, departments: DepartmentWithCount[], excludeId?: number): boolean {
	const normalised = name.trim().toLowerCase();
	return departments.some(d => d.name.toLowerCase() === normalised && d.id !== excludeId);
}

const testIds = {
	card: 'departments-card',
	addInput: 'departments-card-add-input',
	addButton: 'departments-card-add-button',
};

export const DepartmentsCard = () => {
	const { departments, isLoading, isError } = useDepartments();

	const [newDepartmentName, setNewDepartmentName] = useState('');
	const [newDepartmentColor, setNewDepartmentColor] = useState<string>(DEFAULT_DEPARTMENT_COLOR);
	const [newDepartmentNameError, setNewDepartmentNameError] = useState<string | null>(null);
	const [editingState, setEditingState] = useState<EditingState>(null);
	const [reassignDeleteState, setReassignDeleteState] = useState<ReassignDeleteState>(null);

	const { handleCreateDepartment, handleUpdateDepartment, handleDeleteDepartment, isCreatePending, isUpdatePending, isDeletePending } = useDepartmentActions({
		onCreateSuccess: () => {
			setNewDepartmentName('');
			setNewDepartmentColor(DEFAULT_DEPARTMENT_COLOR);
		},
		onUpdateSuccess: () => setEditingState(null),
		onDeleteSuccess: () => setReassignDeleteState(null),
	});

	const handleAdd = useCallback(() => {
		const trimmedName = newDepartmentName.trim();
		if (!trimmedName) return;
		if (isDuplicateName(trimmedName, departments)) {
			setNewDepartmentNameError(DUPLICATE_NAME_ERROR);
			return;
		}
		setNewDepartmentNameError(null);
		handleCreateDepartment(trimmedName, newDepartmentColor);
	}, [newDepartmentName, newDepartmentColor, departments, handleCreateDepartment]);

	const handleNewNameChange = useCallback((value: string) => {
		setNewDepartmentName(value);
		if (newDepartmentNameError) setNewDepartmentNameError(null);
	}, [newDepartmentNameError]);

	const handleEditStart = useCallback((departmentId: number) => {
		const department = departments.find((d: DepartmentWithCount) => d.id === departmentId);
		if (!department) return;
		setEditingState({ departmentId, editValue: department.name, editColor: department.color ?? DEFAULT_DEPARTMENT_COLOR, nameError: null });
	}, [departments]);

	const handleEditValueChange = useCallback((value: string) => {
		setEditingState((prev) => {
			if (!prev) return null;
			return { ...prev, editValue: value, nameError: null };
		});
	}, []);

	const handleEditColorChange = useCallback((color: string) => {
		setEditingState((prev) => {
			if (!prev) return null;
			return { ...prev, editColor: color };
		});
	}, []);

	const handleEditConfirm = useCallback(() => {
		if (!editingState) return;
		const trimmedName = editingState.editValue.trim();
		if (!trimmedName) return;
		if (isDuplicateName(trimmedName, departments, editingState.departmentId)) {
			setEditingState((prev) => prev ? { ...prev, nameError: DUPLICATE_NAME_ERROR } : null);
			return;
		}
		handleUpdateDepartment(editingState.departmentId, trimmedName, editingState.editColor);
	}, [editingState, departments, handleUpdateDepartment]);

	const handleEditCancel = useCallback(() => {
		setEditingState(null);
	}, []);

	const handleDelete = useCallback((departmentId: number) => {
		handleDeleteDepartment(departmentId);
	}, [handleDeleteDepartment]);

	const handleReassignAndDeleteRequest = useCallback((departmentId: number) => {
		const dept = departments.find((d: DepartmentWithCount) => d.id === departmentId);
		if (!dept) return;
		setReassignDeleteState({ id: dept.id, name: dept.name, totalEmployees: dept.totalEmployees });
	}, [departments]);

	const handleReassignAndDeleteConfirm = useCallback((newDepartmentId: number) => {
		if (!reassignDeleteState) return;
		handleDeleteDepartment(reassignDeleteState.id, newDepartmentId);
	}, [reassignDeleteState, handleDeleteDepartment]);

	const replacementDepartmentOptions = useMemo(
		() => departments
			.filter((d: DepartmentWithCount) => d.id !== reassignDeleteState?.id)
			.map((d: DepartmentWithCount) => ({ value: String(d.id), label: d.name })),
		[departments, reassignDeleteState?.id]
	);

	return (
		<>
			<div data-testid={testIds.card}>
				<div className={css.header}>
					<div className={css.headerIcon}>
						<Building2 size={20} aria-hidden="true" />
					</div>
					<div>
						<h3 className={css.title}>Departments</h3>
						<p className={css.subtitle}>Organizational departments</p>
					</div>
				</div>

				<div className={css.addRow}>			<input
					type="color"
					className={css.colorInput}
					value={newDepartmentColor}
					onChange={(e) => setNewDepartmentColor(e.target.value)}
					aria-label="New department colour"
				/>				<div className={css.addInputWrapper}>
					<input
						className={css.addInput}
						placeholder="New department name"
						value={newDepartmentName}
						onChange={(e) => handleNewNameChange(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') handleAdd();
						}}
						data-testid={testIds.addInput}
						aria-label="New department name"
					/>
					{newDepartmentNameError && <p className={css.errorText}>{newDepartmentNameError}</p>}
				</div>
				<Button
					onClick={handleAdd}
					disabled={!newDepartmentName.trim() || isCreatePending}
					data-testid={testIds.addButton}
					className={css.addButton}
				>
					<Plus />
					Add
				</Button>
				</div>

				{isLoading && <p className={css.stateMessage}>Loading departments…</p>}
				{isError && <p className={css.stateMessage}>Failed to load departments.</p>}

				{!isLoading && !isError && (
					<ul className={css.list} role="list">
						{departments.map((department: DepartmentWithCount) => {
							const activeEdit = editingState?.departmentId === department.id ? editingState : null;
							return (
								<DepartmentListItem
									key={department.id}
									department={department}
									isEditing={activeEdit !== null}
									editValue={activeEdit?.editValue ?? ''}
									editColor={activeEdit?.editColor ?? (department.color ?? DEFAULT_DEPARTMENT_COLOR)}
									editNameError={activeEdit?.nameError ?? undefined}
									onEditValueChange={handleEditValueChange}
									onEditColorChange={handleEditColorChange}
									onEditStart={handleEditStart}
									onEditConfirm={handleEditConfirm}
									onEditCancel={handleEditCancel}
									onDelete={handleDelete}
									onReassignAndDelete={handleReassignAndDeleteRequest}
									isUpdatePending={isUpdatePending}
									isDeletePending={isDeletePending}
								/>
							);
						})}
					</ul>
				)}
			</div>

			<ReassignAndDeleteModal
				isOpen={reassignDeleteState !== null}
				onClose={() => setReassignDeleteState(null)}
				attributeLabel={reassignDeleteState?.name ?? ''}
				totalAssignedEmployees={reassignDeleteState?.totalEmployees ?? 0}
				replacementOptions={replacementDepartmentOptions}
				onConfirm={handleReassignAndDeleteConfirm}
				isPending={isDeletePending}
			/>
		</>
	);
};

DepartmentsCard.testIds = testIds;
