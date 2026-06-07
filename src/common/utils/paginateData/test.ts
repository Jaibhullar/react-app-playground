import { paginateData } from '.';

const mockData = [
	{ id: 1, name: 'Item 1' },
	{ id: 2, name: 'Item 2' },
	{ id: 3, name: 'Item 3' },
	{ id: 4, name: 'Item 4' },
	{ id: 5, name: 'Item 5' },
	{ id: 6, name: 'Item 6' },
	{ id: 7, name: 'Item 7' },
	{ id: 8, name: 'Item 8' },
	{ id: 9, name: 'Item 9' },
	{ id: 10, name: 'Item 10' },
];

describe('paginateData', () => {
	describe('basic pagination', () => {
		it('should return first page of items', () => {
			const result = paginateData(mockData, 1, 3);

			expect(result).toEqual([
				{ id: 1, name: 'Item 1' },
				{ id: 2, name: 'Item 2' },
				{ id: 3, name: 'Item 3' },
			]);
		});

		it('should return second page of items', () => {
			const result = paginateData(mockData, 2, 3);

			expect(result).toEqual([
				{ id: 4, name: 'Item 4' },
				{ id: 5, name: 'Item 5' },
				{ id: 6, name: 'Item 6' },
			]);
		});

		it('should return third page of items', () => {
			const result = paginateData(mockData, 3, 3);

			expect(result).toEqual([
				{ id: 7, name: 'Item 7' },
				{ id: 8, name: 'Item 8' },
				{ id: 9, name: 'Item 9' },
			]);
		});

		it('should return partial last page when items don\'t divide evenly', () => {
			const result = paginateData(mockData, 4, 3);

			expect(result).toEqual([{ id: 10, name: 'Item 10' }]);
		});
	});

	describe('different page sizes', () => {
		it('should work with page size of 1', () => {
			const result = paginateData(mockData, 1, 1);

			expect(result).toEqual([{ id: 1, name: 'Item 1' }]);
		});

		it('should work with page size of 5', () => {
			const result = paginateData(mockData, 1, 5);

			expect(result.length).toBe(5);
			expect(result[0].id).toBe(1);
			expect(result[4].id).toBe(5);
		});

		it('should return all items when page size equals data length', () => {
			const result = paginateData(mockData, 1, 10);

			expect(result).toEqual(mockData);
		});

		it('should return all items when page size exceeds data length', () => {
			const result = paginateData(mockData, 1, 20);

			expect(result).toEqual(mockData);
		});
	});

	describe('edge cases', () => {
		it('should return empty array for empty input', () => {
			const result = paginateData([], 1, 5);

			expect(result).toEqual([]);
		});

		it('should return empty array when page exceeds available pages', () => {
			const result = paginateData(mockData, 10, 5);

			expect(result).toEqual([]);
		});

		it('should work with different data types', () => {
			const stringData = ['a', 'b', 'c', 'd', 'e'];

			const result = paginateData(stringData, 1, 2);

			expect(result).toEqual(['a', 'b']);
		});

		it('should work with number arrays', () => {
			const numberData = [1, 2, 3, 4, 5];

			const result = paginateData(numberData, 2, 2);

			expect(result).toEqual([3, 4]);
		});
	});

	describe('boundary conditions', () => {
		it('should handle page 1 correctly (start index 0)', () => {
			const result = paginateData(mockData, 1, 3);

			expect(result[0]).toEqual({ id: 1, name: 'Item 1' });
		});

		it('should not mutate original array', () => {
			const originalData = [...mockData];

			paginateData(mockData, 1, 3);

			expect(mockData).toEqual(originalData);
		});
	});
});
