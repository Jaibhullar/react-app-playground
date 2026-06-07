import { ChevronLeft, ChevronRight } from 'lucide-react';

import { buildPageRange } from '@/common/utils/paginateData';

import css from './Paginator.module.scss';

export type PaginatorProps = {
	currentPage: number,
	totalPages: number,
	onPageChange: (page: number) => void,
};

const testIds = {
	nav: 'paginator',
	previousButton: 'paginator-previous',
	nextButton: 'paginator-next',
	pageButton: (page: number) => `paginator-page-${page}`,
};

export const Paginator = ({ currentPage, totalPages, onPageChange }: PaginatorProps) => {
	if (totalPages <= 1) return null;

	const pageItems = buildPageRange(currentPage, totalPages);

	return (
		<nav aria-label="Pagination" data-testid={testIds.nav} className={css.nav}>
			<button
				type="button"
				data-testid={testIds.previousButton}
				className={css.button}
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				aria-label="Go to previous page"
			>
				<ChevronLeft aria-hidden="true" />
			</button>

			<ol className={css.list}>
				{pageItems.map((item, index) => {
					if (item === 'ellipsis') {
						return (
							<li key={`ellipsis-${index}`} aria-hidden="true">
								<span className={css.ellipsis}>…</span>
							</li>
						);
					}

					const isCurrentPage = item === currentPage;
					return (
						<li key={item}>
							<button
								type="button"
								data-testid={testIds.pageButton(item)}
								className={[css.button, isCurrentPage ? css.buttonActive : undefined]
									.filter(Boolean)
									.join(' ')}
								onClick={() => onPageChange(item)}
								aria-label={`Page ${item}`}
								aria-current={isCurrentPage ? 'page' : undefined}
							>
								{item}
							</button>
						</li>
					);
				})}
			</ol>

			<button
				type="button"
				data-testid={testIds.nextButton}
				className={css.button}
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				aria-label="Go to next page"
			>
				<ChevronRight aria-hidden="true" />
			</button>
		</nav>
	);
};

Paginator.testIds = testIds;
