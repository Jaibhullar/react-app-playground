import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import css from './Tooltip.module.scss';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export type TooltipProps = {
	children: React.ReactNode,
	content: React.ReactNode,
	placement?: TooltipPlacement,
	delayDuration?: number,
	className?: string,
};

const testIds = {
	tooltip: 'tooltip',
	arrow: 'tooltip-arrow',
};

export const arrowStyles: Record<TooltipPlacement, string> = {
	top: css.arrowTop,
	bottom: css.arrowBottom,
	left: css.arrowLeft,
	right: css.arrowRight,
};

const ARROW_OFFSET = 8;

const getTooltipPosition = (
	triggerRect: DOMRect,
	tooltipRect: DOMRect,
	placement: TooltipPlacement
) => {
	let top = 0;
	let left = 0;

	switch (placement) {
		case 'top':
			top = triggerRect.top - tooltipRect.height - ARROW_OFFSET;
			left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
			break;
		case 'bottom':
			top = triggerRect.bottom + ARROW_OFFSET;
			left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
			break;
		case 'left':
			top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
			left = triggerRect.left - tooltipRect.width - ARROW_OFFSET;
			break;
		case 'right':
			top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
			left = triggerRect.right + ARROW_OFFSET;
			break;
	}

	return { top, left };
};

export const Tooltip = ({
	children,
	content,
	placement = 'top',
	delayDuration = 0,
	className,
}: TooltipProps) => {
	const [isVisible, setIsVisible] = useState(false);
	const [position, setPosition] = useState({ top: 0, left: 0 });
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const triggerRef = useRef<HTMLDivElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);

	const updatePosition = useCallback(() => {
		if (triggerRef.current && tooltipRef.current) {
			const triggerRect = triggerRef.current.getBoundingClientRect();
			const tooltipRect = tooltipRef.current.getBoundingClientRect();
			setPosition(getTooltipPosition(triggerRect, tooltipRect, placement));
		}
	}, [placement]);

	const showTooltip = () => {
		if (delayDuration > 0) {
			timeoutRef.current = setTimeout(() => setIsVisible(true), delayDuration);
		}
		else {
			setIsVisible(true);
		}
	};

	const hideTooltip = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setIsVisible(false);
	};

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (isVisible) {
			updatePosition();
		}
	}, [isVisible, updatePosition]);

	useEffect(() => {
		if (!isVisible) return;

		const handlePositionUpdate = () => updatePosition();

		window.addEventListener('scroll', handlePositionUpdate, true);
		window.addEventListener('resize', handlePositionUpdate);

		let resizeObserver: ResizeObserver | null = null;
		if (triggerRef.current) {
			resizeObserver = new ResizeObserver(handlePositionUpdate);
			resizeObserver.observe(triggerRef.current);
		}

		return () => {
			window.removeEventListener('scroll', handlePositionUpdate, true);
			window.removeEventListener('resize', handlePositionUpdate);
			resizeObserver?.disconnect();
		};
	}, [isVisible, updatePosition]);

	return (
		<div
			ref={triggerRef}
			className={css.trigger}
			onMouseEnter={showTooltip}
			onMouseLeave={hideTooltip}
			onFocus={showTooltip}
			onBlur={hideTooltip}
		>
			{children}
			{isVisible &&
        content &&
        createPortal(
        	<div
        		ref={tooltipRef}
        		data-testid={testIds.tooltip}
        		role="tooltip"
        		style={{
        			top: position.top,
        			left: position.left,
        		}}
        		className={[css.tooltip, className].filter(Boolean).join(' ')}
        	>
        		{content}
        		<span className={[css.arrow, arrowStyles[placement]].join(' ')} data-testid={testIds.arrow}/>
        	</div>,
        	document.body
        )}
		</div>
	);
};

Tooltip.testIds = testIds;
