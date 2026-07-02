import { type ReactNode } from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { EmployeeDirectory } from './areas/employees/EmployeeDirectory';
import { SettingsPage } from './areas/settings/pages/SettingsPage';
import { sizeClasses, variantClasses } from './common/components/ui/Button';
import { ROUTES } from './routes';

import css from './App.module.scss';
import buttonCss from './common/components/ui/Button/Button.module.scss';

type AppNavLinkProps = {
	to: string,
	children: ReactNode,
};

const AppNavLink = ({ to, children }: AppNavLinkProps) => (
	<NavLink
		to={to}
		className={({ isActive }) =>
			[buttonCss.button, isActive ? variantClasses.default : variantClasses.ghost, sizeClasses.default].join(' ')
		}
	>
		{children}
	</NavLink>
);

const queryClient = new QueryClient();

export const App = () => (
	<QueryClientProvider client={queryClient}>
		<div className={css.app}>
			<nav className={css.nav}>
				<AppNavLink to={ROUTES.employees}>Employees</AppNavLink>
				<AppNavLink to={ROUTES.settings}>Settings</AppNavLink>
			</nav>
			<Routes>
				<Route path={ROUTES.employees} element={<EmployeeDirectory />} />
				<Route path={ROUTES.settings} element={<SettingsPage />} />
				<Route path="*" element={<Navigate to={ROUTES.employees} replace />} />
			</Routes>
		</div>
	</QueryClientProvider>
);