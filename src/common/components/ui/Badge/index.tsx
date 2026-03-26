import css from './Badge.module.scss';

const testIds = {
	badge: 'badge',
};

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export type BadgeProps = React.ComponentPropsWithoutRef<'span'> & {
	variant?: BadgeVariant,
};

export const variantClasses: Record<BadgeVariant, string> = {
	default: css.variantDefault,
	secondary: css.variantSecondary,
	destructive: css.variantDestructive,
	outline: css.variantOutline,
};

export const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => (
	<span className={[css.badge, variantClasses[variant], className].filter(Boolean).join(' ')} data-testid={testIds.badge} {...props} />
);

Badge.testIds = testIds;