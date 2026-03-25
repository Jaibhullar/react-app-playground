import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { arrowStyles, Tooltip, type TooltipPlacement } from '.';

const testIds = Tooltip.testIds;

const arrowPlacements = Object.entries(arrowStyles).map(([placement, className]) => ({ placement: placement as TooltipPlacement, className }));

describe('Tooltip', () => {
	it('should render children without tooltip initially', ()=>{
		render(<Tooltip content="Tooltip content"><span data-testid="tooltip-trigger">I am a tooltip</span></Tooltip>);

		expect(screen.queryByTestId(testIds.tooltip)).not.toBeInTheDocument();

		expect(screen.getByTestId('tooltip-trigger')).toBeInTheDocument();
	});

	it('should show tooltip with correct content on mouse enter', async ()=>{
		const user = userEvent.setup();
		render(<Tooltip content="Tooltip content"><span data-testid="tooltip-trigger">I am a tooltip</span></Tooltip>);

		const trigger = screen.getByTestId('tooltip-trigger');

		// Simulate mouse enter
		await user.hover(trigger);

		await waitFor(()=>{
			expect(screen.getByTestId(testIds.tooltip)).toBeInTheDocument();
			expect(screen.getByTestId(testIds.tooltip)).toHaveTextContent('Tooltip content');
		});
	});

	it('should hide tooltip on mouse leave', async()=>{
		const user = userEvent.setup();
		render(<Tooltip content="Tooltip content"><span data-testid="tooltip-trigger">I am a tooltip</span></Tooltip>);

		const trigger = screen.getByTestId('tooltip-trigger');

		// Simulate mouse enter
		await user.hover(trigger);

		await waitFor(()=>{
			expect(screen.getByTestId(testIds.tooltip)).toBeInTheDocument();
			expect(screen.getByTestId(testIds.tooltip)).toHaveTextContent('Tooltip content');
		});

		// Simulate mouse leave
		await user.unhover(trigger);

		await waitFor(()=>{
			expect(screen.queryByTestId(testIds.tooltip)).not.toBeInTheDocument();
		});
	});

	it('should show tooltip on focus', async()=>{
		const user = userEvent.setup();

		render(<Tooltip content="Tooltip content"><button data-testid="tooltip-trigger">I am a tooltip</button></Tooltip>);

		// Simulate focus
		await user.tab();

		await waitFor(()=>{
			expect(screen.getByTestId(testIds.tooltip)).toBeInTheDocument();
			expect(screen.getByTestId(testIds.tooltip)).toHaveTextContent('Tooltip content');
		});
	});

	it('should hide tooltip on blur', async()=>{
		const user = userEvent.setup();

		render(<Tooltip content="Tooltip content"><button data-testid="tooltip-trigger">I am a tooltip</button></Tooltip>);

		// Simulate focus
		await user.tab();

		await waitFor(()=>{
			expect(screen.getByTestId(testIds.tooltip)).toBeInTheDocument();
			expect(screen.getByTestId(testIds.tooltip)).toHaveTextContent('Tooltip content');
		});

		// Simulate blur
		await user.tab();

		await waitFor(()=>{
			expect(screen.queryByTestId(testIds.tooltip)).not.toBeInTheDocument();
		});
	});

	it('should respect delayDuration prop', async()=>{
		const user = userEvent.setup();
		render(<Tooltip content="Tooltip content" delayDuration={300}><span data-testid="tooltip-trigger">I am a tooltip</span></Tooltip>);

		const trigger = screen.getByTestId('tooltip-trigger');

		// Simulate mouse enter
		await user.hover(trigger);

		// Tooltip should NOT appear immediately
		expect(screen.queryByTestId(testIds.tooltip)).not.toBeInTheDocument();

		// Wait for the delay and check tooltip appears
		await waitFor(()=>{
			expect(screen.getByTestId(testIds.tooltip)).toBeInTheDocument();
		}, { timeout: 500 }); // Wait up to 500ms (longer than the 300ms delay)
	});

	it.each(arrowPlacements)('should apply correct arrow class for placement: %s', async ({ placement, className })=>{
		const user = userEvent.setup();
		render(<Tooltip content="Tooltip content" placement={placement}><span data-testid="tooltip-trigger">I am a tooltip</span></Tooltip>);

		const trigger = screen.getByTestId('tooltip-trigger');

		await user.hover(trigger);

		await waitFor(()=>{
			const tooltip = screen.getByTestId(testIds.tooltip);
			const arrow = screen.getByTestId(testIds.arrow);
			expect(tooltip).toBeInTheDocument();
			expect(arrow).toHaveClass(className);
		});
	});

	it('should render tooltip in a portal (document.body)', async()=>{
		const user = userEvent.setup();
		const { container } = render(<Tooltip content="Tooltip content"><span data-testid="tooltip-trigger">I am a tooltip</span></Tooltip>);

		const trigger = screen.getByTestId('tooltip-trigger');

		await user.hover(trigger);

		await waitFor(()=>{
			const tooltip = screen.getByTestId(testIds.tooltip);
			expect(tooltip).toBeInTheDocument();
			expect(container).not.toContainElement(tooltip);
			expect(document.body).toContainElement(tooltip);
		});
	});

	it('should apply custom className to tooltip', async()=>{
		const user = userEvent.setup();
		render(<Tooltip content="Tooltip content" className="custom-class"><span data-testid="tooltip-trigger">I am a tooltip</span></Tooltip>);

		const trigger = screen.getByTestId('tooltip-trigger');

		await user.hover(trigger);

		await waitFor(()=>{
			const tooltip = screen.getByTestId(testIds.tooltip);
			expect(tooltip).toHaveClass('custom-class');
		});
	});

	it('should have role="tooltip" attribute', async()=>{
		const user = userEvent.setup();
		render(<Tooltip content="Tooltip content"><span data-testid="tooltip-trigger">I am a tooltip</span></Tooltip>);

		const trigger = screen.getByTestId('tooltip-trigger');

		await user.hover(trigger);

		await waitFor(()=>{
			const tooltip = screen.getByTestId(testIds.tooltip);
			expect(tooltip).toHaveAttribute('role', 'tooltip');
		});
	});

	it('should cancel delayed show on mouse leave before delay completes', async()=>{
		const user = userEvent.setup();

		render(<Tooltip content="Tooltip content" delayDuration={300}><span data-testid="tooltip-trigger">I am a tooltip</span></Tooltip>);

		const trigger = screen.getByTestId('tooltip-trigger');

		await user.hover(trigger);

		// Unhover before the delay duration
		await user.unhover(trigger);

		// Wait longer than the delay to ensure tooltip does not appear
		await waitFor(()=>{
			expect(screen.queryByTestId(testIds.tooltip)).not.toBeInTheDocument();
		}, { timeout: 500 });
	});

	it('should not render tooltip when content is empty/null', async()=>{
		const user = userEvent.setup();
		render(<Tooltip content=""><span data-testid="tooltip-trigger">I am a tooltip</span></Tooltip>);

		const trigger = screen.getByTestId('tooltip-trigger');

		await user.hover(trigger);

		await waitFor(()=>{
			expect(screen.queryByTestId(testIds.tooltip)).not.toBeInTheDocument();
		});
	});
});