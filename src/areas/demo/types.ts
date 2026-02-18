export type DemoItem = {
	id: number,
	name: string,
	status: ItemStatus,
	created: Date,
};


export type ItemStatus = 'active' | 'inactive';
