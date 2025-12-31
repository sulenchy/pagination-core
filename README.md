# pagination-core

[![npm version](https://badge.fury.io/js/pagination-core.svg)](https://badge.fury.io/js/pagination-core)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

A lightweight, headless, UI-agnostic pagination logic library written in TypeScript.

`pagination-core` provides the engine for all your pagination needs without imposing any specific UI framework or structure. You get the state, the methods to manipulate it, and full control over rendering.

## Features

- **✅ UI Agnostic**: Works with React, Vue, Svelte, or even vanilla JavaScript.
- **✅ Headless Logic**: Provides the state and logic, leaving the presentation entirely to you.
- **✅ Lightweight**: Zero dependencies.
- **✅ TypeScript Ready**: Fully typed for a great developer experience.
- **✅ Smart Pages**: Includes logic for creating truncated page lists (e.g., `[1, 2, '...', 9, 10]`).

## Installation

```bash
npm install pagination-core
# or
yarn add pagination-core
# or 
pnpm add pagination-core
```

## How It Works

The library is built around a single function, `createPagination`.

1.  **Initialize**: You call `createPagination` with your configuration (like `total` items and `pageSize`).
2.  **Subscribe**: You provide an `onStateChange` callback. This function will be called with the latest pagination state whenever it changes.
3.  **Render**: Use the state received from `onStateChange` to render your UI.
4.  **Interact**: Call the action methods (`nextPage`, `goToPage`, etc.) returned by `createPagination` in response to user interactions.

## Basic Usage (Vanilla JS)

This example shows how to use `pagination-core` with plain JavaScript to demonstrate its framework-agnostic nature.

```javascript
import { createPagination } from 'pagination-core';

// Get your UI elements
const pagesContainer = document.getElementById('pages');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const currentPageSpan = document.getElementById('current-page');

// 1. Define your state handler
function handleStateChange(state) {
  // 3. Use the state to render your UI
  console.log('New state:', state);

  // Update current page display
  currentPageSpan.textContent = state.currentPage;

  // Disable/enable buttons
  prevButton.disabled = state.isFirstPage;
  nextButton.disabled = state.isLastPage;

  // Render page numbers
  pagesContainer.innerHTML = '';
  state.pageNumbers.forEach(page => {
    if (page === '...') {
      const span = document.createElement('span');
      span.textContent = '...';
      pagesContainer.appendChild(span);
      return;
    }

    const button = document.createElement('button');
    button.textContent = page;
    button.disabled = page === state.currentPage;
    button.addEventListener('click', () => {
      // 4. Call actions on user interaction
      paginator.goToPage(page);
    });
    pagesContainer.appendChild(button);
  });
}


// 2. Initialize the paginator
const paginator = createPagination({
  total: 200,       // Total number of items
  pageSize: 10,     // Items per page
  initialPage: 1,   // (Optional) Initial page
  onStateChange: handleStateChange,
});

// Bind top-level actions
prevButton.addEventListener('click', paginator.previousPage);
nextButton.addEventListener('click', paginator.nextPage);

// Trigger the initial render with the starting state
handleStateChange(paginator.initialState);
```

## API Reference

### `createPagination(options)`

This is the main function to create a pagination instance.

**Options:**

- `total` (number): **Required.** The total number of items to be paginated.
- `pageSize` (number): **Required.** The number of items on each page.
- `initialPage` (number, optional): The page to start on. Defaults to `1`.
- `maxPages` (number, optional): The maximum number of page links to show (e.g., 7 for `[1, 2, 3, 4, 5, 6, 7]`).
- `onStateChange` ((state: PaginationState) => void): **Required.** A callback function that receives the new state object every time a change occurs.

**Returns:** An object with the following properties:

- `initialState` (PaginationState): The initial state of the paginator. Use this to perform your first render.
- `goToPage(page: number)`: A function to jump to a specific page.
- `nextPage()`: A function to advance to the next page.
- `previousPage()`: A function to go to the previous page.

### `PaginationState`

This is the object passed to your `onStateChange` callback and available in `initialState`.

- `currentPage` (number): The current active page.
- `totalPages` (number): The total number of pages calculated from `total` and `pageSize`.
- `isFirstPage` (boolean): `true` if `currentPage` is `1`.
- `isLastPage` (boolean): `true` if `currentPage` equals `totalPages`.
- `startIndex` (number): The 0-based starting index of items for the current page. Useful for slicing arrays (`myItems.slice(startIndex, endIndex + 1)`).
- `endIndex` (number): The 0-based ending index of items for the current page.
- `pageNumbers` (Array<number | '...'>): An array representing the list of pages to display, including ellipsis placeholders for truncated pages.

## License

This project is licensed under the MIT License.