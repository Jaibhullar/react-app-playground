import { render, screen } from '@testing-library/react';

import { Spinner } from '.';

import css from './Spinner.module.scss';

describe('Spinner', () => {
	it('should render with role="status"', () => {
		render(<Spinner data-testid="spinner" />);

		const spinner = screen.getByTestId('spinner');
		expect(spinner).toBeInTheDocument();
		expect(spinner).toHaveAttribute('role', 'status');
	});

	it('should have aria-label="Loading"', () => {
		render(<Spinner data-testid="spinner" />);

		const spinner = screen.getByTestId('spinner');
		expect(spinner).toHaveAttribute('aria-label', 'Loading');
	});

	it('should apply custom className alongside base class', () => {
		render(<Spinner className="custom-class" data-testid="spinner" />);

		const spinner = screen.getByTestId('spinner');
		expect(spinner).toHaveClass('custom-class');
		expect(spinner).toHaveClass(css.spinner);
	});

	it('should forward additional props', () => {
		render(<Spinner data-testid="spinner" aria-hidden="true" />);

		const spinner = screen.getByTestId('spinner');
		expect(spinner).toHaveAttribute('aria-hidden', 'true');
	});
});
