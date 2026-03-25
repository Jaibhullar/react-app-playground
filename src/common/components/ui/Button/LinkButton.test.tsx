import { render, screen } from '@testing-library/react';

import { LinkButton } from './LinkButton';
import { type ButtonSize, type ButtonVariant, sizeClasses, variantClasses } from '.';

import css from './Button.module.scss';

const testIds = LinkButton.testIds;

const variants = Object.entries(variantClasses).map(([variant, className])=>({ variant: variant as ButtonVariant, className }));

const sizes = Object.entries(sizeClasses).map(([size, className])=>({ size: size as ButtonSize, className }));

describe('LinkButton', () => {
	it('should render with default variant and size', ()=>{
		render(<LinkButton>Click me</LinkButton>);

		const linkButton = screen.getByTestId(testIds.linkButton);

		expect(linkButton).toBeInTheDocument();

		expect(linkButton).toHaveClass(css.variantDefault);
		expect(linkButton).toHaveClass(css.sizeDefault);
	});

	it.each(variants)('should apply $variant variant class', ({ variant, className })=>{
		render(<LinkButton variant={variant}>Click me</LinkButton>);
		const linkButton = screen.getByTestId(testIds.linkButton);
		expect(linkButton).toHaveClass(className);
	});

	it.each(sizes)('should apply $size size class', ({ size, className })=>{
		render(<LinkButton size={size}>Click me</LinkButton>);
		const linkButton = screen.getByTestId(testIds.linkButton);
		expect(linkButton).toHaveClass(className);
	});

	it('should render children content correctly', ()=>{
		render(<LinkButton>Click me</LinkButton>);

		const linkButton = screen.getByTestId(testIds.linkButton);
		expect(linkButton).toHaveTextContent('Click me');
	});

	it('should accept and apply href attribute', ()=>{
		render(<LinkButton href='www.test.com'>Click me</LinkButton>);

		const linkButton = screen.getByTestId(testIds.linkButton);

		expect(linkButton).toHaveAttribute('href', 'www.test.com');
	});


	it('should apply custom className alongside base classes', ()=>{
		render(<LinkButton className='custom-class'>Click me</LinkButton>);

		const linkButton = screen.getByTestId(testIds.linkButton);

		expect(linkButton).toHaveClass('custom-class');
		expect(linkButton).toHaveClass(css.button);
	});

	it('should forward additional props (target, rel, data-testid etc.)', ()=>{
		render(<LinkButton href='www.test.com' target='_blank' rel='noopener noreferrer' data-testid='custom-link-button'>Click me</LinkButton>);

		const linkButton = screen.getByTestId('custom-link-button');

		expect(linkButton).toHaveAttribute('target', '_blank');
		expect(linkButton).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('should render icons within link button', ()=>{
		const Icon = () => <span data-testid='icon'>Icon</span>;
		render(<LinkButton><Icon />Click me</LinkButton>);

		const linkButton = screen.getByTestId(testIds.linkButton);
		const icon = screen.getByTestId('icon');

		expect(linkButton).toContainElement(icon);
	});
});