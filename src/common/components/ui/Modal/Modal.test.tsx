import { fireEvent, render, screen } from '@testing-library/react';

import { Modal, ModalProps, ModalSize, sizeClasses } from '.';

import css from './Modal.module.scss';

const testIds = Modal.testIds;

const DEFAULT_TITLE = 'Test Modal Title';
const DEFAULT_CHILDREN = 'Modal body content';

const defaultProps: ModalProps = {
	isOpen: true,
	onClose: vi.fn(),
	title: DEFAULT_TITLE,
	children: DEFAULT_CHILDREN,
};

const modalSizes = Object.entries(sizeClasses).map(([size, className]) => ({
	size: size as ModalSize,
	className,
}));

describe('Modal', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('visibility', () => {
		it('should render when isOpen is true', () => {
			render(<Modal {...defaultProps} />);

			expect(screen.getByTestId(testIds.modal)).toBeInTheDocument();
		});

		it('should not render when isOpen is false', () => {
			render(<Modal {...defaultProps} isOpen={false} />);

			expect(screen.queryByTestId(testIds.modal)).not.toBeInTheDocument();
		});
	});

	describe('content', () => {
		it('should render the title', () => {
			render(<Modal {...defaultProps} />);

			expect(screen.getByText(DEFAULT_TITLE)).toBeInTheDocument();
		});

		it('should render children in the body', () => {
			render(<Modal {...defaultProps} />);

			expect(screen.getByTestId(testIds.body)).toHaveTextContent(DEFAULT_CHILDREN);
		});

		it('should render footer content when footer is provided', () => {
			render(<Modal {...defaultProps} footer={<button>Confirm</button>} />);

			expect(screen.getByTestId(testIds.footer)).toBeInTheDocument();
			expect(screen.getByText('Confirm')).toBeInTheDocument();
		});

		it('should not render footer section when footer is not provided', () => {
			render(<Modal {...defaultProps} />);

			expect(screen.queryByTestId(testIds.footer)).not.toBeInTheDocument();
		});
	});

	describe('close behaviour', () => {
		it('should call onClose when the close button is clicked', () => {
			render(<Modal {...defaultProps} />);

			fireEvent.click(screen.getByTestId(testIds.closeButton));

			expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
		});

		it('should call onClose when the overlay backdrop is clicked', () => {
			render(<Modal {...defaultProps} />);

			fireEvent.click(screen.getByTestId(testIds.overlay));

			expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
		});

		it('should not call onClose when the modal content is clicked', () => {
			render(<Modal {...defaultProps} />);

			fireEvent.click(screen.getByTestId(testIds.body));

			expect(defaultProps.onClose).not.toHaveBeenCalled();
		});

		it('should call onClose when the Escape key is pressed', () => {
			render(<Modal {...defaultProps} />);

			fireEvent.keyDown(document, { key: 'Escape' });

			expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
		});

		it('should not call onClose when a non-Escape key is pressed', () => {
			render(<Modal {...defaultProps} />);

			fireEvent.keyDown(document, { key: 'Enter' });

			expect(defaultProps.onClose).not.toHaveBeenCalled();
		});

		it('should not call onClose when Escape is pressed after the modal has closed', () => {
			const { rerender } = render(<Modal {...defaultProps} />);

			rerender(<Modal {...defaultProps} isOpen={false} />);
			fireEvent.keyDown(document, { key: 'Escape' });

			expect(defaultProps.onClose).not.toHaveBeenCalled();
		});
	});

	describe('size variants', () => {
		it.each(modalSizes)('should apply the $size size class', ({ size, className }) => {
			render(<Modal {...defaultProps} size={size} />);

			expect(screen.getByTestId(testIds.modal)).toHaveClass(className);
		});

		it('should apply the md size class by default', () => {
			render(<Modal {...defaultProps} />);

			expect(screen.getByTestId(testIds.modal)).toHaveClass(css.sizeMd);
		});
	});

	describe('className', () => {
		it('should apply a custom className alongside the default modal class', () => {
			render(<Modal {...defaultProps} className="custom-class" />);

			const modal = screen.getByTestId(testIds.modal);

			expect(modal).toHaveClass('custom-class');
			expect(modal).toHaveClass(css.modal);
		});
	});

	describe('accessibility', () => {
		it('should have role="dialog" and aria-modal="true"', () => {
			render(<Modal {...defaultProps} />);

			const dialog = screen.getByTestId(testIds.modal);

			expect(dialog).toHaveAttribute('role', 'dialog');
			expect(dialog).toHaveAttribute('aria-modal', 'true');
		});

		it('should be labelled by the title via aria-labelledby', () => {
			render(<Modal {...defaultProps} />);

			expect(screen.getByRole('dialog', { name: DEFAULT_TITLE })).toBeInTheDocument();
		});

		it('should have an accessible label on the close button', () => {
			render(<Modal {...defaultProps} />);

			expect(screen.getByTestId(testIds.closeButton)).toHaveAttribute('aria-label', 'Close modal');
		});
	});
});
