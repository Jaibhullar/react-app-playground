export type PageItem = number | 'ellipsis';

/**
 * Minimum window half-size around the current page.
 * A window of 1 means we show currentPage - 1, currentPage, currentPage + 1.
 */
const WINDOW_SIZE = 1;

/**
 * Below this page count, every page is shown with no ellipsis needed.
 */
const ALWAYS_SHOW_THRESHOLD = 7;

/**
 * Builds the ordered list of page items to render in a paginator.
 * Always includes the first and last page; collapses gaps > 1 with an 'ellipsis' sentinel.
 *
 * Examples (totalPages = 10):
 *   currentPage = 1  → [1, 2, 'ellipsis', 10]
 *   currentPage = 5  → [1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]
 *   currentPage = 10 → [1, 'ellipsis', 9, 10]
 */
export const buildPageRange = (currentPage: number, totalPages: number): PageItem[] => {
	if (totalPages <= ALWAYS_SHOW_THRESHOLD) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	const windowStart = Math.max(2, currentPage - WINDOW_SIZE);
	const windowEnd = Math.min(totalPages - 1, currentPage + WINDOW_SIZE);

	const items: PageItem[] = [1];

	if (windowStart > 2) {
		items.push('ellipsis');
	}

	for (let i = windowStart; i <= windowEnd; i++) {
		items.push(i);
	}

	if (windowEnd < totalPages - 1) {
		items.push('ellipsis');
	}

	items.push(totalPages);

	return items;
};
