import { describe, it, expect } from "vitest";
import { createPagination } from "../src/createPagination";

describe("createPagination", () => {
  it("should return the correct pagination for the first page", () => {
    const result = createPagination({
      totalItems: 100,
      itemsPerPage: 10,
      currentPage: 1,
    });
    expect(result.pages).toEqual([1, 2, 3, 4, 5, "ellipsis", 10]);
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(10);
    expect(result.hasNext).toBe(true);
    expect(result.hasPrevious).toBe(false);
    expect(result.nextPage).toBe(2);
    expect(result.previousPage).toBe(null);
  });

  it("should return the correct pagination for a middle page", () => {
    const result = createPagination({
      totalItems: 100,
      itemsPerPage: 10,
      currentPage: 5,
    });
    expect(result.pages).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 10]);
    expect(result.currentPage).toBe(5);
    expect(result.totalPages).toBe(10);
    expect(result.hasNext).toBe(true);
    expect(result.hasPrevious).toBe(true);
    expect(result.nextPage).toBe(6);
    expect(result.previousPage).toBe(4);
  });

  it("should return the correct pagination for the last page", () => {
    const result = createPagination({
      totalItems: 100,
      itemsPerPage: 10,
      currentPage: 10,
    });
    expect(result.pages).toEqual([1, "ellipsis", 6, 7, 8, 9, 10]);
    expect(result.currentPage).toBe(10);
    expect(result.totalPages).toBe(10);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrevious).toBe(true);
    expect(result.nextPage).toBe(null);
    expect(result.previousPage).toBe(9);
  });

  it("should handle a small number of pages", () => {
    const result = createPagination({
      totalItems: 30,
      itemsPerPage: 10,
      currentPage: 2,
    });
    expect(result.pages).toEqual([1, 2, 3]);
    expect(result.currentPage).toBe(2);
    expect(result.totalPages).toBe(3);
    expect(result.hasNext).toBe(true);
    expect(result.hasPrevious).toBe(true);
    expect(result.nextPage).toBe(3);
    expect(result.previousPage).toBe(1);
  });

  it("should handle a single page", () => {
    const result = createPagination({
      totalItems: 5,
      itemsPerPage: 10,
      currentPage: 1,
    });
    expect(result.pages).toEqual([1]);
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrevious).toBe(false);
    expect(result.nextPage).toBe(null);
    expect(result.previousPage).toBe(null);
  });

  it("should handle siblingCount correctly", () => {
    const result = createPagination({
      totalItems: 100,
      itemsPerPage: 10,
      currentPage: 5,
      siblingCount: 1,
    });
    expect(result.pages).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 10]);
  });
});
