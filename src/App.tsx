import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { DemoList } from './areas/demo/DemoList';
import { Badge } from './common/components/ui/Badge';
import { Button } from './common/components/ui/Button';
import { Tooltip } from './common/components/ui/Tooltip';

const queryClient = new QueryClient();

export const App = () => {
	return <QueryClientProvider client={queryClient}>
		{/* <div> This is your playground - have fun! </div> */}
		<Button onClick={() => alert('Button clicked!')}>Click me</Button>
		<Badge variant="destructive">I'm a badge</Badge>
		<div style={{ margin: 100 }}>
			<Tooltip content="Tooltip content"><span data-testid="tooltip-trigger">I am a tooltip</span></Tooltip>
		</div>
		{/* <DemoList /> */}
	</QueryClientProvider>;
};