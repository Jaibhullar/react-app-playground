import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { DemoList } from './areas/demo/DemoList';

const queryClient = new QueryClient();

export const App = () => {
	return <QueryClientProvider client={queryClient}>
		<div> This is your playground - have fun! </div>
		<DemoList />
	</QueryClientProvider>;
};