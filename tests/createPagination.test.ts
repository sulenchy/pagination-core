import { describe, it, expect, vi } from "vitest";
import { createPagination } from "../src/createPagination";
import { PaginationState } from "../src/types";

describe("createPagination", () => {
  it("should return the correct initial state for the first page", () => {
    const handleChange = vi.fn();
    const paginator = createPagination({
      totalItems: 100,
      itemsPerPage: 10,
      onStateChange: handleChange,
    });

    const { initialState } = paginator;
    expect(initialState.pages).toEqual([1, 2, 3, "ellipsis", 10]);
    expect(initialState.currentPage).toBe(1);
    expect(initialState.totalPages).toBe(10);
    expect(initialState.hasNext).toBe(true);
    expect(initialState.hasPrevious).toBe(false);
    expect(initialState.nextPage).toBe(2);
    expect(initialState.previousPage).toBe(null);
  });

  it("should call onStateChange with the correct state when nextPage is called", () => {
    const handleChange = vi.fn();
    const paginator = createPagination({
      totalItems: 100,
      itemsPerPage: 10,
      initialPage: 1,
      onStateChange: handleChange,
    });

    paginator.nextPage();

    expect(handleChange).toHaveBeenCalledTimes(1);
    const newState = handleChange.mock.calls[0][0] as PaginationState;
    expect(newState.currentPage).toBe(2);
    expect(newState.previousPage).toBe(1);
    expect(newState.pages).toEqual([1, 2, 3, 4, "ellipsis", 10]);
  });

  it("should call onStateChange with the correct state when previousPage is called", () => {
    const handleChange = vi.fn();
    const paginator = createPagination({
      totalItems: 100,
      itemsPerPage: 10,
      initialPage: 3,
      onStateChange: handleChange,
    });

    paginator.previousPage();

    expect(handleChange).toHaveBeenCalledTimes(1);
    const newState = handleChange.mock.calls[0][0] as PaginationState;
    expect(newState.currentPage).toBe(2);
    expect(newState.nextPage).toBe(3);
    expect(newState.pages).toEqual([1, 2, 3, 4, "ellipsis", 10]);
  });

  it("should call onStateChange with the correct state when goToPage is called", () => {
    const handleChange = vi.fn();
    const paginator = createPagination({
      totalItems: 100,
      itemsPerPage: 10,
      onStateChange: handleChange,
    });

    paginator.goToPage(5);

    expect(handleChange).toHaveBeenCalledTimes(1);
    const newState = handleChange.mock.calls[0][0] as PaginationState;
    expect(newState.currentPage).toBe(5);
    expect(newState.pages).toEqual([1, "ellipsis", 3, 4, 5, 6, 7, "ellipsis", 10]);
  });

  it("should not call onStateChange if trying to go to the same page", () => {
    const handleChange = vi.fn();
    const paginator = createPagination({
      totalItems: 100,
      itemsPerPage: 10,
      initialPage: 3,
      onStateChange: handleChange,
    });

    paginator.goToPage(3);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("should not call onStateChange if trying to go to an invalid page", () => {
    const handleChange = vi.fn();
    const paginator = createPagination({
      totalItems: 100,
      itemsPerPage: 10,
      onStateChange: handleChange,
    });

    paginator.goToPage(0);
    paginator.goToPage(11);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("should handle siblingCount correctly on state changes", () => {
    const handleChange = vi.fn();
    const paginator = createPagination({
      totalItems: 100,
      itemsPerPage: 10,
      siblingCount: 1,
      onStateChange: handleChange,
    });

    paginator.goToPage(5);

    expect(handleChange).toHaveBeenCalledTimes(1);
    const newState = handleChange.mock.calls[0][0] as PaginationState;
    expect(newState.currentPage).toBe(5);
    expect(newState.pages).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 10]);
  });
});