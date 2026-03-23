import express from 'express';
import { createPagination, PaginationState } from 'pagination-core';

const app = express();
const PORT = 3000;

// Mock data: An array of 200 items
const allItems = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
  name: `Item #${i + 1}`,
}));

app.get('/items', (req, res) => {
  // 1. Get the desired page from the query parameters, default to 1
  const requestedPage = parseInt(req.query.page as string, 10) || 1;
  const itemsPerPage = 10;

  let paginationState: PaginationState | null = null;

  // 2. Create a paginator instance.
  // The `onStateChange` callback captures the state when it's computed.
  const paginator = createPagination({
    totalItems: allItems.length,
    itemsPerPage,
    initialPage: 1, // We start at 1 and then go to the requested page
    onStateChange: (state) => {
      paginationState = state;
    },
  });

  // 3. Navigate to the requested page. This triggers `onStateChange`.
  // We use the initial state if the requested page is the first page.
  if (requestedPage === 1) {
    paginationState = paginator.initialState;
  } else {
    paginator.goToPage(requestedPage);
  }

  // If the requested page was invalid (e.g., too high), goToPage does nothing,
  // and paginationState might still be null.
  if (!paginationState) {
    return res.status(404).json({ error: 'Page not found' });
  }

  // 4. Calculate the slice of data for the current page
  const startIndex = (paginationState.currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = allItems.slice(startIndex, endIndex);

  // 5. Send the response
  res.json({
    pagination: paginationState,
    data: pageData,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Try visiting:');
  console.log(`http://localhost:${PORT}/items`);
  console.log(`http://localhost:${PORT}/items?page=5`);
  console.log(`http://localhost:${PORT}/items?page=10`);
});
