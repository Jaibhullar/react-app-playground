import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { EmployeeDirectory } from './areas/employees/EmployeeDirectory';
import { Layout } from './common/components/Layout';

const queryClient = new QueryClient();

export const App = () => {
	return <QueryClientProvider client={queryClient}>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<div>Home</div>} />
					<Route path="employees" element={<EmployeeDirectory />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</QueryClientProvider>;
};