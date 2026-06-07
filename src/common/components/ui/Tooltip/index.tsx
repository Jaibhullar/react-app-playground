import css from './Tooltip.module.scss';

const testIds = {
	tooltip: 'tooltip',
};

export type TooltipProps = {
	content: string,
	children: React.ReactNode,
	show?: boolean,
};

export const Tooltip = ({ content, children, show = true }: TooltipProps) => {
	if (!show) return <>{children}</>;

	return (
		<span className={css.wrapper} data-testid={testIds.tooltip}>
			{children}
			<span className={css.content} role="tooltip">{content}</span>
		</span>
	);
};

Tooltip.testIds = testIds;
