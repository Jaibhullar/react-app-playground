import { render, screen } from '@testing-library/react';

import { Button, ButtonSize, ButtonVariant, sizeClasses, variantClasses } from '.';

import css from './Button.module.scss';

const testIds = Button.testIds;

const variants = Object.entries(variantClasses).map(([variant, className])=>({ variant: variant as ButtonVariant, className }));

const sizes = Object.entries(sizeClasses).map(([size, className])=>({ size: size as ButtonSize, className }));

describe('Button', ()=>{
	it('should render with default variant and size', ()=>{
		render(<Button>Click me</Button>);

		const button = screen.getByTestId(testIds.button);

		expect(button).toBeInTheDocument();

		expect(button).toHaveClass(css.variantDefault);
		expect(button).toHaveClass(css.sizeDefault);
	});

	it.each(variants)('should apply $variant variant class', ({ variant, className })=>{
		render(<Button variant={variant}>Click me</Button>);
		const button = screen.getByTestId(testIds.button);
		expect(button).toHaveClass(className);
	});

	it.each(sizes)('should apply $size size class', ({ size, className })=>{
		render(<Button size={size}>Click me</Button>);
		const button = screen.getByTestId(testIds.button);
		expect(button).toHaveClass(className);
	});

	it('should have type="button" by default', ()=>{
		render(<Button>Click me</Button>);

		const button = screen.getByTestId(testIds.button);
		expect(button).toHaveAttribute('type', 'button');
	});

	it('should render children content correctly', ()=>{
		render(<Button>Click me</Button>);

		const button = screen.getByTestId(testIds.button);
		expect(button).toHaveTextContent('Click me');
	});

	it('should handle onClick event', ()=>{
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>Click me</Button>);

		const button = screen.getByTestId(testIds.button);
		button.click();

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('should not trigger onClick when disabled', ()=>{
		const handleClick = vi.fn();
		render(<Button disabled onClick={handleClick}>Click me</Button>);

		const button = screen.getByTestId(testIds.button);
		expect(button).toBeDisabled();

		button.click();

		expect(handleClick).not.toHaveBeenCalled();
	});

	it('should apply custom className alongside base classes', ()=>{
		render(<Button className="custom-class">Click me</Button>);

		const button = screen.getByTestId(testIds.button);
		expect(button).toHaveClass('custom-class');
		expect(button).toHaveClass(css.button);
	});

	it('should forward additional props (data-testid, aria-label, etc.)', ()=>{
		render(<Button data-testid="custom-button" aria-label="Custom Button">Click me</Button>);

		const button = screen.getByTestId('custom-button');
		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute('aria-label', 'Custom Button');
	});

	it('should render icons within button', ()=>{
		const Icon = () => <span data-testid="icon">Icon</span>;

		render(<Button><Icon /> Click me</Button>);

		const button = screen.getByTestId(testIds.button);
		const icon = screen.getByTestId('icon');

		expect(button).toContainElement(icon);
	});
});