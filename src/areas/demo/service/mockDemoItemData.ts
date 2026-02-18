
import { DTO_DemoItem } from './demoItemService';

let idCounter = 0;

function createData(name: string, status: string): DTO_DemoItem {
	const created = new Date().toJSON();
	return {
		id: idCounter++,
		name,
		status,
		created,
	};
}

function generateDataSet(count: number) {
	const dataSet: DTO_DemoItem[] = [];
	for (let i = 1; i <= count; i++) {
		dataSet.push(createData(`Item ${i}`, i % 4 == 0 ? 'inactive' : 'active'));
	}
	return dataSet;
}

export const mockData = generateDataSet(15);