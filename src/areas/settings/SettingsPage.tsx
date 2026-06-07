import { DepartmentSettings } from '@/areas/departments/DepartmentSettings';
import { LocationSettings } from '@/areas/locations/LocationSettings';
import { RoleSettings } from '@/areas/roles/RoleSettings';
import { Button } from '@/common/components/ui/Button';

import css from './SettingsPage.module.scss';

export const SettingsPage = () => {
	return (
		<div className={css.page}>
			<header className={css.page_header}>
				<h1 className={css.page_title}>Settings</h1>
				<p className={css.page_subtitle}>Manage your company reference data.</p>
			</header>
			<div className={css.layout}>
				<nav className={css.side_nav} aria-label="Settings sections">
					<p className={css.side_nav_heading}>Sections</p>
					<Button asLink href="#departments" variant="ghost" className={css.nav_link}>Departments</Button>
					<Button asLink href="#locations" variant="ghost" className={css.nav_link}>Locations</Button>
					<Button asLink href="#roles" variant="ghost" className={css.nav_link}>Roles</Button>
				</nav>
				<div className={css.content}>
					<section id="departments" className={`${css.card} ${css.section_anchor}`}>
						<DepartmentSettings />
					</section>
					<section id="locations" className={`${css.card} ${css.section_anchor}`}>
						<LocationSettings />
					</section>
					<section id="roles" className={`${css.card} ${css.section_anchor}`}>
						<RoleSettings />
					</section>
				</div>
			</div>
		</div>
	);
};
