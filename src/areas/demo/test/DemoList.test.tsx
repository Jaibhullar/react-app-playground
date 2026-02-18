
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DemoList } from '../DemoList';
import { DemoGetItemsRequest, executeGetDemoItems } from '../service/demoItemService';
import { DemoItem } from '../types';

const testData : DemoItem[] = [
	{ id: 1, name: 'Item 1', status: 'active', created: new Date() },
	{ id: 2, name: 'Item 2', status: 'inactive', created: new Date() },
];

vi.mock('../demoService');
vi.mocked(executeGetDemoItems).mockImplementation(() => Promise.resolve({ items: testData }));

const testIds = DemoList.testIds;

function renderComponent() {
	const queryClient = new QueryClient( {
		defaultOptions: { queries: { retry: false } },
	});
	render(
		<QueryClientProvider client={queryClient}>	        <DemoList />
		</QueryClientProvider>
	);
}

describe('DemoList', () => {
	it('renders loader while getting data', async () => {
		vi.mocked(executeGetDemoItems).mockImplementation(() => new Promise(() => {}));
		renderComponent();

		expect(screen.getByTestId(testIds.loader)).toBeInTheDocument();
	});

	it('renders error message if there is an error getting data', async () => {
		vi.mocked(executeGetDemoItems).mockImplementation(() => Promise.reject(new Error('fail')));
		renderComponent();

		const errorMsg = await screen.findByTestId(testIds.error);
		expect(errorMsg).toBeInTheDocument();
	});

	it('renders table with data when data is successfully loaded', async () => {
		vi.mocked(executeGetDemoItems).mockImplementation(() => Promise.resolve({ items: testData }));
		renderComponent();

		const table = await screen.findByTestId(testIds.table);
		expect(table).toBeInTheDocument();

		expect(screen.getByText(testData[0].name)).toBeInTheDocument();
		expect(screen.getByText(testData[1].name)).toBeInTheDocument();
	});

	it('filters items based on status filter selection', async () => {
		const user = userEvent.setup();
		vi.mocked(executeGetDemoItems).mockImplementation((req: DemoGetItemsRequest) => {
			const filteredItems = testData.filter(it => it.status === req.status);
			return Promise.resolve({ items: filteredItems });
		});

		renderComponent();
		await screen.findByTestId(testIds.table);

		// Change filter to "active"
		const select = screen.getByTestId(testIds.filter) as HTMLSelectElement;
		await user.selectOptions(select, 'active');
		expect(await screen.findByText(testData[0].name)).toBeInTheDocument();
		await waitFor(
			() => expect(screen.queryByText(testData[1].name)).not.toBeInTheDocument()
		);

		// Change filter to "inactive"
		await user.selectOptions(select, 'inactive');
		expect(await screen.findByText(testData[1].name)).toBeInTheDocument();
		await waitFor(
			() => expect(screen.queryByText(testData[0].name)).not.toBeInTheDocument()
		);
	});
});
