// Button and LinkButton are separate files because they use different
// HTML elements (<button> vs <a>) with distinct behaviors and props

import css from './Button.module.scss';

const testIds = {
	button: 'button',
};

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
	variant?: ButtonVariant,
	size?: ButtonSize,
};

export const variantClasses: Record<ButtonVariant, string> = {
	default: css.variantDefault,
	secondary: css.variantSecondary,
	outline: css.variantOutline,
	ghost: css.variantGhost,
	destructive: css.variantDestructive,
};

export const sizeClasses: Record<ButtonSize, string> = {
	default: css.sizeDefault,
	sm: css.sizeSm,
	lg: css.sizeLg,
	icon: css.sizeIcon,
};

export const Button = ({ className, variant = 'default', size = 'default', ...props }: ButtonProps) => (
	<button
		type="button"
		data-testid={testIds.button}
		className={[css.button, variantClasses[variant], sizeClasses[size], className].filter(Boolean).join(' ')}
		{...props}
	/>
);

Button.testIds = testIds;
