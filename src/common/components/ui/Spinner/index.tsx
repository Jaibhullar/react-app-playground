import { Loader2Icon } from 'lucide-react';

import css from './Spinner.module.scss';

export type SpinnerProps = React.ComponentPropsWithoutRef<'svg'>;

export const Spinner = ({ className, ...props }: SpinnerProps) => (
	<Loader2Icon
		role="status"
		aria-label="Loading"
		className={[css.spinner, className].filter(Boolean).join(' ')}
		{...props}
	/>
);