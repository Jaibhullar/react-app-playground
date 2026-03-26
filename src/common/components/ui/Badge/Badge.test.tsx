import { render, screen } from '@testing-library/react';

import { Badge, BadgeVariant, variantClasses } from '.';

const testIds = Badge.testIds;

const badgeVariants = Object.entries(variantClasses).map(([variant, className]) => ({ variant: variant as BadgeVariant, className }));

describe('Badge', () => {
	it('should render with default variant', ()=>{
		render(<Badge>Default Badge</Badge>);

		const badge = screen.getByTestId(testIds.badge);

		expect(badge).toBeInTheDocument();
		expect(badge).toHaveClass(variantClasses.default);
	});

	it('should render children content correctly', ()=>{
		render(<Badge>Default Badge</Badge>);

		const badge = screen.getByTestId(testIds.badge);

		expect(badge).toBeInTheDocument();
		expect(badge).toHaveTextContent('Default Badge');
	});

	it.each(badgeVariants)('should apply $variant variant class', ({ variant, className })=>{
		render(<Badge variant={variant}>Badge</Badge>);
		const badge = screen.getByTestId(testIds.badge);
		expect(badge).toHaveClass(className);
	});

	it('should apply custom className alongside base classes', ()=>{
		render(<Badge className="custom-class">Badge</Badge>);

		const badge = screen.getByTestId(testIds.badge);

		expect(badge).toHaveClass('custom-class');
	});

	it('should forward additional props (data-testid, aria-label, etc.)', ()=>{
		render(<Badge data-testid="custom-badge" aria-label="Custom Badge">Badge</Badge>);

		const badge = screen.getByTestId('custom-badge');

		expect(badge).toBeInTheDocument();
		expect(badge).toHaveAttribute('aria-label', 'Custom Badge');
	});

	it('should render icons within badge', ()=>{
		const Icon = () => <span data-testid='icon'>Icon</span>;
		render(<Badge><Icon />Badge</Badge>);

		const badge = screen.getByTestId(testIds.badge);
		const icon = screen.getByTestId('icon');

		expect(badge).toContainElement(icon);
	});
});