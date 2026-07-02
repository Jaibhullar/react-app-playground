import { DepartmentsCard } from './DepartmentsCard';
import { LocationsCard } from './LocationsCard';
import { RolesCard } from './RolesCard';

import css from './WorkforceAttributesSection.module.scss';

export const WorkforceAttributesSection = () => (
	<section className={css.section}>
		<div className={css.intro}>
			<h2>Workforce Attributes</h2>
			<p>Manage the departments, locations and roles available when creating or editing employees.</p>
		</div>
		<div className={css.cards}>
			<RolesCard />
			<LocationsCard />
			<div className={css.fullWidth}>
				<DepartmentsCard />
			</div>
		</div>
	</section>
);
