import css from './Button.module.scss';

const testIds = {
	button: 'button',
	linkButton: 'link-button',
};

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

type ButtonAsButton = {
	asLink?: false,
} & React.ComponentPropsWithoutRef<'button'> & {
	variant?: ButtonVariant,
	size?: ButtonSize,
};

type ButtonAsLink = {
	asLink: true,
} & React.ComponentPropsWithoutRef<'a'> & {
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

export const Button = (props: ButtonAsButton | ButtonAsLink) => {

	if (props.asLink === true) {
		const { asLink, variant = 'default', size = 'default', className, ...rest } = props;
		return (
			<a
				data-testid={testIds.linkButton}
				className={[css.button, variantClasses[variant], sizeClasses[size], className].filter(Boolean).join(' ')}
				{...rest}
			/>
		);
	}

	const { asLink, variant = 'default', size = 'default', className, ...rest } = props;
	return (
		<button
			type="button"
			data-testid={testIds.button}
			className={[css.button, variantClasses[variant], sizeClasses[size], className].filter(Boolean).join(' ')}
			{...rest}
		/>
	);
};

Button.testIds = testIds;
