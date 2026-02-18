import { API_BASE_URL } from '@/common/constants';

import { DemoItem, ItemStatus } from '../types';

// Separate DTO (Data Transfer Object) types are defined here to accurately reflect the types returned by the API response and keep them separate from the application types.
export type DTO_DemoItem = {
	id: number,
	name: string,
	status: string,
	created: string,
};

export type DTO_DemoGetItemsResponse = {
	items: DTO_DemoItem[],
};

export type ItemStatusFilter = ItemStatus | 'all';

export type DemoGetItemsRequest = {
	status: ItemStatusFilter,
};

export type DemoGetItemsResponse = {
	items: DemoItem[],
};

const getItemsRoute = '/demo/:status' as const;

function transformDTO(dto: DTO_DemoItem) {
	// Note that there is no data validation here - we are assuming the API response is contract compliant for simplicity.
	const item : DemoItem = {
		id: dto.id,
		name: dto.name,
		status: dto.status as ItemStatus,
		created: new Date(dto.created),
	};
	return item;
}

export async function executeGetDemoItems(request: DemoGetItemsRequest) {
	const url = getQueryUrl(request);

	// Note there is no error handling and we are using base fetch here for demo simplicity.
	return fetch(url)
		.then(response =>
			response.json()
		)
		.then(json => {
			const responseDTO = json as DTO_DemoGetItemsResponse;
			const response : DemoGetItemsResponse = { items: responseDTO.items.map(transformDTO) };
			return response;
		});
}


function getQueryUrl(request: DemoGetItemsRequest) {
	return `${API_BASE_URL}${getItemsRoute.replace(':status', request.status)}`;
}

export const demoServiceMeta = { routes: { getItems: getItemsRoute } };