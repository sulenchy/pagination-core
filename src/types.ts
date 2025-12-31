export type PaginationItem = "ellipsis" | number;

/**
 * Configuration options for the createPagination function.
 */
export interface PaginationOptions {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
  siblingCount?: number;
  onStateChange: (state: PaginationState) => void;
}

/**
 * The state of the pagination. This object is passed to the onStateChange callback.
 */
export interface PaginationState {
  pages: PaginationItem[];
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

/**
 * The return value of the createPagination function.
 */
export interface Pagination {
  initialState: PaginationState;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
}