export const paginateData = <T>(
	data: T[],
	currentPage: number,
	itemsPerPage: number
): T[] => {
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = currentPage * itemsPerPage;
	return data.slice(startIndex, endIndex);
};
