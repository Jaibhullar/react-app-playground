import { SettingsNav, type SettingsNavItem } from '../../components/SettingsNav';
import { WorkforceAttributesSection } from './WorkforceAttributesSection';

import css from './SettingsPage.module.scss';

const SECTION_IDS = {
	workforceAttributes: 'workforce-attributes',
} as const;

const NAV_ITEMS: SettingsNavItem[] = [
	{ id: SECTION_IDS.workforceAttributes, label: 'Workforce Attributes' },
];

const testIds = {
	page: 'settings-page',
	aside: 'settings-aside',
};

export const SettingsPage = () => (
	<div className={css.page} data-testid={testIds.page}>
		<header className={css.header}>
			<h1 className={css.title}>Settings</h1>
		</header>
		<div className={css.layout}>
			<aside className={css.aside} data-testid={testIds.aside}>
				<SettingsNav items={NAV_ITEMS} />
			</aside>
			<main className={css.main}>
				<div id={SECTION_IDS.workforceAttributes} className={css.card}>
					<WorkforceAttributesSection />
				</div>
			</main>
		</div>
	</div>
);

SettingsPage.testIds = testIds;
