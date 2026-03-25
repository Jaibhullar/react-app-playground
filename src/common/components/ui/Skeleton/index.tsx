import css from './Skeleton.module.scss';

export type SkeletonProps = React.ComponentPropsWithoutRef<'div'>;

export const Skeleton = ({ className, ...props }: SkeletonProps) => (
	<div className={[css.skeleton, className].filter(Boolean).join(' ')} {...props} />
);
