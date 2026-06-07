import { useCallback, useState } from 'react';

import { Button } from '@/common/components/ui/Button';
import { Modal } from '@/common/components/ui/Modal';
import { Select } from '@/common/components/ui/Select';

import css from './ReassignAndDeleteModal.module.scss';

const testIds = {
	select: 'reassign-delete-modal-select',
	confirmButton: 'reassign-delete-modal-confirm',
	cancelButton: 'reassign-delete-modal-cancel',
};

export type ReassignAndDeleteModalProps = {
	isOpen: boolean,
	onClose: () => void,
	/** Name of the attribute being deleted, e.g. "Engineering" */
	attributeLabel: string,
	totalAssignedEmployees: number,
	/** Replacement options — must exclude the attribute being deleted */
	replacementOptions: Array<{
		value: string,
		label: string,
	}>,
	onConfirm: (newAttributeId: number) => void,
	isPending: boolean,
};

export const ReassignAndDeleteModal = ({
	isOpen,
	onClose,
	attributeLabel,
	totalAssignedEmployees,
	replacementOptions,
	onConfirm,
	isPending,
}: ReassignAndDeleteModalProps) => {
	const [selectedId, setSelectedId] = useState('');

	const handleClose = useCallback(() => {
		setSelectedId('');
		onClose();
	}, [onClose]);

	const handleConfirm = useCallback(() => {
		if (!selectedId) return;
		onConfirm(Number(selectedId));
	}, [selectedId, onConfirm]);

	const handleSelectionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedId(e.target.value);
	}, []);

	const employeeWord = totalAssignedEmployees === 1 ? 'employee is' : 'employees are';

	const allOptions = [
		{ value: '', label: 'Select a replacement…', disabled: true },
		...replacementOptions,
	];

	const footer = (
		<>
			<Button
				data-testid={testIds.cancelButton}
				variant="outline"
				onClick={handleClose}
				disabled={isPending}
			>
				Cancel
			</Button>
			<Button
				data-testid={testIds.confirmButton}
				variant="destructive"
				onClick={handleConfirm}
				disabled={!selectedId || isPending}
			>
				{isPending ? 'Deleting…' : 'Reassign & Delete'}
			</Button>
		</>
	);

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title={`Delete "${attributeLabel}"?`}
			footer={footer}
			size="sm"
		>
			<p className={css.description}>
				{totalAssignedEmployees} {employeeWord} assigned here. Select a replacement to move them to before deleting.
			</p>
			<div className={css.field}>
				<label className={css.label} htmlFor="reassignSelect">
					Move employees to
				</label>
				<Select
					id="reassignSelect"
					data-testid={testIds.select}
					options={allOptions}
					value={selectedId}
					onChange={handleSelectionChange}
				/>
			</div>
		</Modal>
	);
};

ReassignAndDeleteModal.testIds = testIds;
