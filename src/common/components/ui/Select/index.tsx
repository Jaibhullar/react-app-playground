import { ChevronDown } from 'lucide-react';

import css from './Select.module.scss';

const testIds = {
	select: 'select',
	wrapper: 'select-wrapper',
};

export type SelectOption = {
	value: string,
	label: string,
	disabled?: boolean,
};

export type SelectSize = 'sm' | 'md' | 'lg';

export type SelectProps = Omit<React.ComponentPropsWithoutRef<'select'>, 'size'> & {
	options: SelectOption[],
	placeholder?: string,
	size?: SelectSize,
	isError?: boolean,
};

export const sizeClasses: Record<SelectSize, string> = {
	sm: css.sizeSm,
	md: css.sizeMd,
	lg: css.sizeLg,
};

export const Select = ({ options, placeholder, size = 'md', isError = false, className, ...rest }: SelectProps) => (
	<div data-testid={testIds.wrapper} className={css.wrapper}>
		<select
			data-testid={testIds.select}
			className={[css.select, sizeClasses[size], isError && css.isError, className].filter(Boolean).join(' ')}
			{...rest}
		>
			{placeholder && (
				<option value="" disabled>
					{placeholder}
				</option>
			)}
			{options.map(({ value, label, disabled }) => (
				<option key={value} value={value} disabled={disabled}>
					{label}
				</option>
			))}
		</select>
		<ChevronDown className={css.icon} aria-hidden="true" />
	</div>
);

Select.testIds = testIds;
