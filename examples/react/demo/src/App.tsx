import { useState, useMemo } from "react";
import { createPagination, type PaginationState } from "pagination-core";
import "./App.css";

// Mock data: An array of 100 items (e.g., products, posts)
const items = Array.from({ length: 100 }, (_, i) => `Item #${i + 1}`);

function App() {
  // State to keep track of the pagination state
  const [paginationState, setPaginationState] = useState<PaginationState | null>(
    null
  );

  // --- pagination-core usage ---
  // Create a pagination instance using useMemo to avoid re-creating it on every render.
  const pagination = useMemo(
    () =>
      createPagination({
        totalItems: items.length,
        itemsPerPage: 10,
        onStateChange: setPaginationState,
      }),
    []
  );

  // Set the initial state
  useState(() => {
    setPaginationState(pagination.initialState);
  });

  if (!paginationState) {
    return <div>Loading...</div>;
  }

  // --- Derived State ---
  // Calculate the start and end index for the items on the current page.
  const startIndex = (paginationState.currentPage - 1) * 10;
  const endIndex = startIndex + 10;
  const currentItems = items.slice(startIndex, endIndex);

  return (
    <div className="App">
      <h1>pagination-core React Demo</h1>

      {/* Display the list of items for the current page */}
      <div className="items-list">
        {currentItems.map((item) => (
          <div key={item} className="item">
            {item}
          </div>
        ))}
      </div>

      {/* --- Pagination Controls --- */}
      <div className="pagination-controls">
        {/* Previous Page Button */}
        <button
          onClick={pagination.previousPage}
          disabled={!paginationState.hasPrevious}
        >
          Previous
        </button>

        {/* Page Number Buttons */}
        {paginationState.pages.map((page, index) =>
          typeof page === "number" ? (
            <button
              key={page}
              onClick={() => pagination.goToPage(page)}
              className={
                page === paginationState.currentPage ? "active" : ""
              }
            >
              {page}
            </button>
          ) : (
            <span key={`ellipsis-${index}`} className="ellipsis">
              ...
            </span>
          )
        )}

        {/* Next Page Button */}
        <button onClick={pagination.nextPage} disabled={!paginationState.hasNext}>
          Next
        </button>
      </div>

      {/* --- Display Pagination Info --- */}
      <div className="pagination-info">
        <p>Current Page: {paginationState.currentPage}</p>
        <p>Total Pages: {paginationState.totalPages}</p>
      </div>

      <style>{`
        .App {
          font-family: sans-serif;
          text-align: center;
          padding: 2rem;
        }

        .items-list {
          margin-bottom: 1rem;
        }

        .item {
          padding: 0.5rem;
          border-bottom: 1px solid #eee;
        }

        .pagination-controls button,
        .pagination-controls .ellipsis {
          margin: 0 0.25rem;
          padding: 0.5rem 0.75rem;
          border: 1px solid #ccc;
          background-color: #fff;
          cursor: pointer;
        }

        .pagination-controls .ellipsis {
          border: none;
          cursor: default;
        }

        .pagination-controls button.active {
          background-color: #007bff;
          color: #fff;
          border-color: #007bff;
        }

        .pagination-controls button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .pagination-info {
          margin-top: 1rem;
          font-size: 0.9rem;
          color: #555;
        }
      `}</style>
    </div>
  );
}

export default App;
