import { type ButtonSize, type ButtonVariant, sizeClasses, variantClasses } from '.';

import css from './Button.module.scss';

const testIds = {
	linkButton: 'link-button',
};

export type LinkButtonProps = React.ComponentPropsWithoutRef<'a'> & {
	variant?: ButtonVariant,
	size?: ButtonSize,
};

export const LinkButton = ({ className, variant = 'default', size = 'default', ...props }: LinkButtonProps) => (
	<a
		data-testid={testIds.linkButton}
		className={[css.button, variantClasses[variant], sizeClasses[size], className].filter(Boolean).join(' ')}
		{...props}
	/>
);

LinkButton.testIds = testIds;
