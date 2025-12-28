import { PaginationConfig, PaginationItem, PaginationResult } from "./types";

export function createPagination({
  totalItems,
  itemsPerPage,
  currentPage = 1,
  siblingCount = 2
}: PaginationConfig): PaginationResult {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pages: PaginationItem[] = [];

  const start = Math.max(2, currentPage - siblingCount);
  const end = Math.min(totalPages - 1, currentPage + siblingCount);

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
    currentPage,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    previousPage: currentPage > 1 ? currentPage - 1 : null
  };
}
