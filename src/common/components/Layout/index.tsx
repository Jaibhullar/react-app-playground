import { NavLink, Outlet } from 'react-router-dom';

import css from './Layout.module.scss';

export const Layout = () => {
	return (
		<div>
			<nav className={css.nav}>
				{/* Link - basic navigation */}
				<NavLink to="/">Home</NavLink>

				{/* NavLink - adds 'active' class when current */}
				<NavLink to="/employees">Employees</NavLink>
			</nav>

			{/* Outlet renders the child route */}
			<main className={css.main}>
				<Outlet />
			</main>
		</div>
	);
};