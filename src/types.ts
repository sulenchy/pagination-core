export type PaginationItem = number | "ellipsis";

export interface PaginationConfig {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  siblingCount?: number;
}

export interface PaginationResult {
  pages: PaginationItem[];
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  nextPage: number | null;
  previousPage: number | null;
}
