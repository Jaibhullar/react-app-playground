
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { executeGetDemoItems, ItemStatusFilter } from './service/demoItemService';

import css from './demoList.module.scss';

const testIds = {
	loader: 'demo-list-loader',
	error: 'demo-list-error',
	table: 'demo-list-table',
	filter: 'demo-list-filter',
};

export const DemoList = () => {
	const [status, setStatus] = useState<ItemStatusFilter>('all');

	const { data, isLoading, isError } = useQuery({
		queryKey: ['demoItems', status],
		queryFn: () => executeGetDemoItems({ status }),
	});

	const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		setStatus(value as ItemStatusFilter);
	};

	return (
		<div>
			<h2>Demo Items List</h2>
			<label>
				Filter by status:
				<select value={status} onChange={handleStatusChange} data-testid={testIds.filter}>
					<option value="all">All</option>
					<option value="active">Active</option>
					<option value="inactive">Inactive</option>
				</select>
			</label>
			{isLoading &&
			<p data-testid={testIds.loader}>
				Loading...
			</p>}
			{isError &&
			<p className={css.error} data-testid={testIds.error}>
				Error loading items.
			</p>
			}
			{data && (
				<table className={css.table} data-testid={testIds.table}>
					<thead>
						<tr>
							<th>Name</th>
							<th>Status</th>
							<th>Created</th>
						</tr>
					</thead>
					<tbody>
						{data.items.map(item => (
							<tr key={item.id}>
								<td>{item.name}</td>
								<td>{item.status}</td>
								<td>{item.created.toLocaleString()}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};
DemoList.testIds = testIds;