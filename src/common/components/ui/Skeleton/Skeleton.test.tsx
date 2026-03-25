import { render, screen } from '@testing-library/react';

import { Skeleton } from '.';

import css from './Skeleton.module.scss';

describe('Skeleton', () => {
	it('should apply custom className alongside base class', () => {
		render(<Skeleton className="custom-class" data-testid="skeleton" />);

		const skeleton = screen.getByTestId('skeleton');
		expect(skeleton).toHaveClass('custom-class');
		expect(skeleton).toHaveClass(css.skeleton);
	});

	it('should forward additional props', () => {
		render(<Skeleton data-testid="skeleton" aria-label="Loading skeleton" />);

		const skeleton = screen.getByTestId('skeleton');
		expect(skeleton).toHaveAttribute('aria-label', 'Loading skeleton');
	});
});
