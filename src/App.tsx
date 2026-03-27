import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { EmployeeDirectory } from './areas/employees/EmployeeDirectory';

const queryClient = new QueryClient();

export const App = () => {
	return <QueryClientProvider client={queryClient}>
		<div> This is your playground - have fun! </div>
		<EmployeeDirectory />
	</QueryClientProvider>;
};