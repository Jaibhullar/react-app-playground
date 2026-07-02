import css from './SettingsNav.module.scss';

export type SettingsNavItem = {
	id: string,
	label: string,
};

export type SettingsNavProps = {
	items: SettingsNavItem[],
};

const testIds = {
	nav: 'settings-nav',
	link: (id: string) => `settings-nav-link-${id}`,
};

export const SettingsNav = ({ items }: SettingsNavProps) => (
	<nav className={css.nav} aria-label="Settings navigation" data-testid={testIds.nav}>
		<p className={css.heading}>On this page</p>
		<ul className={css.list} role="list">
			{items.map(item => (
				<li key={item.id}>
					<a
						href={`#${item.id}`}
						className={css.link}
						data-testid={testIds.link(item.id)}
					>
						{item.label}
					</a>
				</li>
			))}
		</ul>
	</nav>
);

SettingsNav.testIds = testIds;
