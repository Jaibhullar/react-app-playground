import { fireEvent, render, screen } from '@testing-library/react';

import { Select, SelectOption, SelectProps, SelectSize, sizeClasses } from '.';

import css from './Select.module.scss';

const testIds = Select.testIds;

const DEFAULT_OPTIONS: SelectOption[] = [
	{ value: 'apple', label: 'Apple' },
	{ value: 'banana', label: 'Banana' },
	{ value: 'cherry', label: 'Cherry' },
];

const defaultProps: SelectProps = {
	options: DEFAULT_OPTIONS,
};

const selectSizes = Object.entries(sizeClasses).map(([size, className]) => ({
	size: size as SelectSize,
	className,
}));

describe('Select', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('rendering', () => {
		it('should render the select element', () => {
			render(<Select {...defaultProps} />);

			expect(screen.getByTestId(testIds.select)).toBeInTheDocument();
		});

		it('should render all provided options', () => {
			render(<Select {...defaultProps} />);

			expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
			expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
			expect(screen.getByRole('option', { name: 'Cherry' })).toBeInTheDocument();
		});

		it('should render option values correctly', () => {
			render(<Select {...defaultProps} />);

			expect(screen.getByRole<HTMLOptionElement>('option', { name: 'Apple' }).value).toBe('apple');
			expect(screen.getByRole<HTMLOptionElement>('option', { name: 'Banana' }).value).toBe('banana');
		});

		it('should render a disabled option when option.disabled is true', () => {
			const options: SelectOption[] = [
				{ value: 'active', label: 'Active' },
				{ value: 'archived', label: 'Archived', disabled: true },
			];

			render(<Select {...defaultProps} options={options} />);

			expect(screen.getByRole<HTMLOptionElement>('option', { name: 'Archived' }).disabled).toBe(true);
			expect(screen.getByRole<HTMLOptionElement>('option', { name: 'Active' }).disabled).toBe(false);
		});
	});

	describe('placeholder', () => {
		it('should render a placeholder option when placeholder is provided', () => {
			render(<Select {...defaultProps} placeholder="Select a fruit" />);

			expect(screen.getByRole('option', { name: 'Select a fruit' })).toBeInTheDocument();
		});

		it('should render the placeholder as a disabled option', () => {
			render(<Select {...defaultProps} placeholder="Select a fruit" />);

			expect(screen.getByRole<HTMLOptionElement>('option', { name: 'Select a fruit' }).disabled).toBe(true);
		});

		it('should not render a placeholder option when placeholder is not provided', () => {
			render(<Select {...defaultProps} />);

			// Only the real options should exist
			expect(screen.getAllByRole('option')).toHaveLength(DEFAULT_OPTIONS.length);
		});
	});

	describe('size variants', () => {
		it.each(selectSizes)('should apply the $size size class', ({ size, className }) => {
			render(<Select {...defaultProps} size={size} />);

			expect(screen.getByTestId(testIds.select)).toHaveClass(className);
		});

		it('should apply the md size class by default', () => {
			render(<Select {...defaultProps} />);

			expect(screen.getByTestId(testIds.select)).toHaveClass(css.sizeMd);
		});
	});

	describe('error state', () => {
		it('should apply the isError class when isError is true', () => {
			render(<Select {...defaultProps} isError />);

			expect(screen.getByTestId(testIds.select)).toHaveClass(css.isError);
		});

		it('should not apply the isError class by default', () => {
			render(<Select {...defaultProps} />);

			expect(screen.getByTestId(testIds.select)).not.toHaveClass(css.isError);
		});
	});

	describe('className', () => {
		it('should apply a custom className alongside the base select class', () => {
			render(<Select {...defaultProps} className="custom-class" />);

			const select = screen.getByTestId(testIds.select);

			expect(select).toHaveClass('custom-class');
			expect(select).toHaveClass(css.select);
		});
	});

	describe('native props', () => {
		it('should forward the name attribute', () => {
			render(<Select {...defaultProps} name="fruit" />);

			expect(screen.getByTestId(testIds.select)).toHaveAttribute('name', 'fruit');
		});

		it('should forward aria-label', () => {
			render(<Select {...defaultProps} aria-label="Choose a fruit" />);

			expect(screen.getByTestId(testIds.select)).toHaveAttribute('aria-label', 'Choose a fruit');
		});

		it('should be disabled when the disabled prop is passed', () => {
			render(<Select {...defaultProps} disabled />);

			expect(screen.getByTestId(testIds.select)).toBeDisabled();
		});
	});

	describe('interaction', () => {
		it('should call onChange when a new option is selected', () => {
			const handleChange = vi.fn();

			render(<Select {...defaultProps} onChange={handleChange} />);

			fireEvent.change(screen.getByTestId(testIds.select), { target: { value: 'banana' } });

			expect(handleChange).toHaveBeenCalledTimes(1);
		});


	});
});
