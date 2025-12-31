import {
  Pagination,
  PaginationItem,
  PaginationOptions,
  PaginationState,
} from "./types";

export function createPagination({
  totalItems,
  itemsPerPage,
  initialPage = 1,
  siblingCount = 2,
  onStateChange,
}: PaginationOptions): Pagination {
  let currentPage = initialPage;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  function computeState(page: number): PaginationState {
    const pages: PaginationItem[] = [];

    const start = Math.max(2, page - siblingCount);
    const end = Math.min(totalPages - 1, page + siblingCount);

    // First page
    pages.push(1);

    // Left ellipsis
    if (start > 2) {
      pages.push("ellipsis");
    }

    // Middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Right ellipsis
    if (end < totalPages - 1) {
      pages.push("ellipsis");
    }

    // Last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return {
      pages,
      currentPage: page,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
    };
  }

  const initialState = computeState(currentPage);

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      currentPage = page;
      onStateChange(computeState(currentPage));
    }
  }

  function nextPage() {
    goToPage(currentPage + 1);
  }

  function previousPage() {
    goToPage(currentPage - 1);
  }

  return {
    initialState,
    goToPage,
    nextPage,
    previousPage,
  };
}
