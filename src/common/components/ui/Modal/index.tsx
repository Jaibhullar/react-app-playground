import { useCallback, useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

import css from './Modal.module.scss';

const testIds = {
	overlay: 'modal-overlay',
	modal: 'modal',
	closeButton: 'modal-close-button',
	body: 'modal-body',
	footer: 'modal-footer',
};

export type ModalSize = 'sm' | 'md' | 'lg';

export type ModalProps = {
	isOpen: boolean,
	onClose: () => void,
	title: string,
	children: React.ReactNode,
	footer?: React.ReactNode,
	size?: ModalSize,
	className?: string,
};

export const sizeClasses: Record<ModalSize, string> = {
	sm: css.sizeSm,
	md: css.sizeMd,
	lg: css.sizeLg,
};

export const Modal = ({ isOpen, onClose, title, children, footer, size = 'md', className }: ModalProps) => {
	const titleId = useId();
	const modalRef = useRef<HTMLDivElement>(null);

	const handleKeyDown = useCallback((event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			onClose();
		}
	}, [onClose]);

	useEffect(() => {
		if (!isOpen) return;

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, handleKeyDown]);

	useEffect(() => {
		if (isOpen) {
			modalRef.current?.focus();
		}
	}, [isOpen]);

	const handleOverlayClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}, [onClose]);

	if (!isOpen) return null;

	return createPortal(
		<div
			data-testid={testIds.overlay}
			className={css.overlay}
			onClick={handleOverlayClick}
		>
			<div
				ref={modalRef}
				data-testid={testIds.modal}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				tabIndex={-1}
				className={[css.modal, sizeClasses[size], className].filter(Boolean).join(' ')}
			>
				<div className={css.header}>
					<h2 id={titleId} className={css.title}>{title}</h2>
					<button
						type="button"
						data-testid={testIds.closeButton}
						className={css.closeButton}
						onClick={onClose}
						aria-label="Close modal"
					>
						<X />
					</button>
				</div>
				<div data-testid={testIds.body} className={css.body}>
					{children}
				</div>
				{footer && (
					<div data-testid={testIds.footer} className={css.footer}>
						{footer}
					</div>
				)}
			</div>
		</div>,
		document.body
	);
};

Modal.testIds = testIds;
