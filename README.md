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
  prevButton.disabled = !state.hasPrevious;
  nextButton.disabled = !state.hasNext;

  // Render page numbers
  pagesContainer.innerHTML = '';
  state.pages.forEach(page => {
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
  totalItems: 200,       // Total number of items
  itemsPerPage: 10,     // Items per page
  initialPage: 1,   // (Optional) Initial page
  onStateChange: handleStateChange,
});

// Bind top-level actions
prevButton.addEventListener('click', paginator.previousPage);
nextButton.addEventListener('click', paginator.nextPage);

// Trigger the initial render with the starting state
handleStateChange(paginator.initialState);
```

## React Usage Example

Here is how you can use `pagination-core` in a React component with hooks.

```jsx
import React, { useState, useMemo } from 'react';
import { createPagination, PaginationState } from 'pagination-core';

// Assuming `allItems` is an array of objects you want to paginate
// const allItems = Array.from({ length: 100 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));

const PaginatedList = ({ allItems }) => {
  // The paginator instance is memoized to prevent re-creation on every render.
  const paginator = useMemo(() => {
    return createPagination({
      totalItems: allItems.length,
      itemsPerPage: 10,
      onStateChange: (state) => {
        // The callback updates the component's state.
        setPaginationState(state);
      },
    });
  }, [allItems.length]);

  // Initialize the component's state with the paginator's initial state.
  const [paginationState, setPaginationState] = useState(paginator.initialState);

  const {
    currentPage,
    pages,
    hasNext,
    hasPrevious,
    startIndex,
    endIndex,
  } = paginationState;

  // Get the slice of items for the current page.
  const currentItems = allItems.slice(startIndex, endIndex + 1);

  return (
    <div>
      <h3>Page {currentPage}</h3>
      <ul>
        {currentItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>

      <nav style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button onClick={paginator.previousPage} disabled={!hasPrevious}>
          &larr; Previous
        </button>

        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <span key={index}>...</span>
          ) : (
            <button
              key={index}
              onClick={() => paginator.goToPage(page)}
              style={{ fontWeight: page === currentPage ? 'bold' : 'normal' }}
            >
              {page}
            </button>
          )
        )}

        <button onClick={paginator.nextPage} disabled={!hasNext}>
          Next &rarr;
        </button>
      </nav>
    </div>
  );
};
```

## Vue.js Usage Example

Here is a complete example using Vue 3's Composition API (`<script setup>`).

```vue
<script setup>
import { ref, computed } from 'vue';
import { createPagination } from 'pagination-core';

// Accept all items as a prop
const props = defineProps({
  allItems: {
    type: Array,
    required: true,
  },
});

// This will hold the current state provided by the paginator
const paginationState = ref(null);

// The paginator instance is created once when the component is set up.
const paginator = createPagination({
  totalItems: props.allItems.length,
  itemsPerPage: 10,
  onStateChange: (newState) => {
    paginationState.value = newState;
  },
});

// Set the initial state for the first render.
paginationState.value = paginator.initialState;

// A computed property to automatically get the items for the current page.
// It will re-calculate whenever paginationState changes.
const currentItems = computed(() => {
  if (!paginationState.value) return [];
  const { startIndex, endIndex } = paginationState.value;
  return props.allItems.slice(startIndex, endIndex + 1);
});
</script>

<template>
  <div v-if="paginationState">
    <h3>Page {{ paginationState.currentPage }}</h3>
    <ul>
      <li v-for="item in currentItems" :key="item.id">{{ item.name }}</li>
    </ul>

    <nav style="display: flex; gap: 8px; align-items: center;">
      <button @click="paginator.previousPage" :disabled="!paginationState.hasPrevious">
        &larr; Previous
      </button>

      <template v-for="(page, index) in paginationState.pages">
        <span v-if="page === 'ellipsis'" :key="`ellipsis-${index}`">...</span>
        <button
          v-else
          :key="page"
          @click="paginator.goToPage(page)"
          :style="{ fontWeight: page === paginationState.currentPage ? 'bold' : 'normal' }"
        >
          {{ page }}
        </button>
      </template>

      <button @click="paginator.nextPage" :disabled="!paginationState.hasNext">
        Next &rarr;
      </button>
    </nav>
  </div>
</template>
```

## Svelte Usage Example

Here is a complete example for a Svelte component.

```svelte
<script>
  import { createPagination } from 'pagination-core';

  // Accept allItems as a prop
  export let allItems = [];

  let paginationState;

  // The paginator instance is created once when the component initializes.
  const paginator = createPagination({
    totalItems: allItems.length,
    itemsPerPage: 10,
    onStateChange: (newState) => {
      // In Svelte, reactivity is triggered by assignment.
      paginationState = newState;
    },
  });

  // Set the initial state for the first render.
  paginationState = paginator.initialState;

  // Create a "derived" value for currentItems.
  // This block will re-run automatically whenever paginationState changes.
  $: currentItems = allItems.slice(
    paginationState.startIndex,
    paginationState.endIndex + 1
  );
</script>

{#if paginationState}
  <div>
    <h3>Page {paginationState.currentPage}</h3>
    <ul>
      {#each currentItems as item (item.id)}
        <li>{item.name}</li>
      {/each}
    </ul>

    <nav style="display: flex; gap: 8px; align-items: center;">
      <button on:click={paginator.previousPage} disabled={!paginationState.hasPrevious}>
        &larr; Previous
      </button>

      {#each paginationState.pages as page}
        {#if page === 'ellipsis'}
          <span>...</span>
        {:else}
          <button
            on:click={() => paginator.goToPage(page)}
            style:font-weight={page === paginationState.currentPage ? 'bold' : 'normal'}
          >
            {page}
          </button>
        {/if}
      {/each}

      <button on:click={paginator.nextPage} disabled={!paginationState.hasNext}>
        Next &rarr;
      </button>
    </nav>
  </div>
{/if}
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