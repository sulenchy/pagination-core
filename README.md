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

## Usage Examples

### React

Here's a simple example of how to use `pagination-core` in a React component with hooks.

```jsx
import { useState, useMemo } from "react";
import { createPagination, type PaginationState } from "pagination-core";

function Pagination() {
  const [paginationState, setPaginationState] = useState(null);

  const { goToPage, nextPage, previousPage, initialState } = useMemo(
    () =>
      createPagination({
        totalItems: 100,
        itemsPerPage: 10,
        onStateChange: setPaginationState,
      }),
    []
  );

  useState(() => {
    setPaginationState(initialState);
  });

  if (!paginationState) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={previousPage} disabled={!paginationState.hasPrevious}>
        Previous
      </button>

      {paginationState.pages.map((page, i) =>
        typeof page === "number" ? (
          <button
            key={i}
            onClick={() => goToPage(page)}
            disabled={page === paginationState.currentPage}
          >
            {page}
          </button>
        ) : (
          <span key={i}>...</span>
        )
      )}

      <button onClick={nextPage} disabled={!paginationState.hasNext}>
        Next
      </button>
    </div>
  );
}
```

### Vue.js

Here is a basic implementation in a Vue component using the Composition API.

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { createPagination } from 'pagination-core';

const paginationState = ref(null);

const { goToPage, nextPage, previousPage, initialState } = createPagination({
  totalItems: 100,
  itemsPerPage: 10,
  onStateChange: (newState) => {
    paginationState.value = newState;
  },
});

onMounted(() => {
  paginationState.value = initialState;
});
</script>

<template>
  <div v-if="paginationState">
    <button @click="previousPage" :disabled="!paginationState.hasPrevious">
      Previous
    </button>

    <template v-for="(page, i) in paginationState.pages" :key="i">
      <button
        v-if="typeof page === 'number'"
        @click="goToPage(page)"
        :disabled="page === paginationState.currentPage"
      >
        {{ page }}
      </button>
      <span v-else>...</span>
    </template>

    <button @click="nextPage" :disabled="!paginationState.hasNext">
      Next
    </button>
  </div>
</template>
```

### Svelte

Here is a basic implementation in a Svelte component.

```svelte
<script>
  import { createPagination } from "pagination-core";
  import { onMount } from "svelte";

  let paginationState = null;

  const { goToPage, nextPage, previousPage, initialState } = createPagination({
    totalItems: 100,
    itemsPerPage: 10,
    onStateChange: (newState) => {
      paginationState = newState;
    },
  });

  onMount(() => {
    paginationState = initialState;
  });
</script>

{#if paginationState}
  <div>
    <button on:click={previousPage} disabled={!paginationState.hasPrevious}>
      Previous
    </button>

    {#each paginationState.pages as page}
      {#if typeof page === "number"}
        <button
          on:click={() => goToPage(page)}
          disabled={page === paginationState.currentPage}
        >
          {page}
        </button>
      {:else}
        <span>...</span>
      {/if}
    {/each}

    <button on:click={nextPage} disabled={!paginationState.hasNext}>
      Next
    </button>
  </div>
{/if}
```

### Vanilla JS

This example shows how to use `pagination-core` with plain JavaScript to demonstrate its framework-agnostic nature.

```javascript
import { createPagination } from 'pagination-core';

const pagesContainer = document.getElementById('pages');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const currentPageSpan = document.getElementById('current-page');

function handleStateChange(state) {
  console.log('New state:', state);

  currentPageSpan.textContent = state.currentPage;
  prevButton.disabled = !state.hasPrevious;
  nextButton.disabled = !state.hasNext;

  pagesContainer.innerHTML = '';
  state.pages.forEach(page => {
    if (page === 'ellipsis') {
      const span = document.createElement('span');
      span.textContent = '...';
      pagesContainer.appendChild(span);
      return;
    }

    const button = document.createElement('button');
    button.textContent = page;
    button.disabled = page === state.currentPage;
    button.addEventListener('click', () => paginator.goToPage(page));
    pagesContainer.appendChild(button);
  });
}

const paginator = createPagination({
  totalItems: 200,
  itemsPerPage: 10,
  onStateChange: handleStateChange,
});

prevButton.addEventListener('click', paginator.previousPage);
nextButton.addEventListener('click', paginator.nextPage);

// Trigger the initial render
handleStateChange(paginator.initialState);
```

## Demos

You can find working demo applications for various frameworks in the `examples/` directory.

### React Demo

To run the React demo:

1.  Navigate to the demo directory: `cd examples/react/demo`
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`
4.  Open your browser to the address provided by Vite.

### Svelte Demo

To run the Svelte demo:

1.  Navigate to the demo directory: `cd examples/svelte/demo`
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`
4.  Open your browser to the address provided by Vite.

### Vue.js Demo

To run the Vue.js demo:

1.  Navigate to the demo directory: `cd examples/vue/demo`
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`
4.  Open your browser to the address provided by Vite.

### Server Demo (Node.js)

This demo shows how to use `pagination-core` in a Node.js/Express backend to serve paginated data via a REST API.

1.  Navigate to the demo directory: `cd examples/server/demo`
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run start`
4.  The server will be running at `http://localhost:3000`. You can test the API endpoint by visiting `http://localhost:3000/items?page=2` in your browser or API client.

## API Reference

### `createPagination(options)`

This is the main function to create a pagination instance.

**Options:**

- `totalItems` (number): **Required.** The total number of items to be paginated.
- `itemsPerPage` (number): **Required.** The number of items on each page.
- `initialPage` (number, optional): The page to start on. Defaults to `1`.
- `siblingCount` (number, optional): The number of page links to display on either side of the current page. Defaults to `2`.
- `onStateChange` ((state: PaginationState) => void): **Required.** A callback function that receives the latest pagination state whenever it changes.

**Returns:** An object with the following properties:

- `initialState` (PaginationState): The initial state of the paginator. Use this to perform your first render.
- `goToPage(page: number)`: A function to jump to a specific page.
- `nextPage()`: A function to advance to the next page.
- `previousPage()`: A function to go to the previous page.

### `PaginationState`

This is the object passed to your `onStateChange` callback and available in `initialState`.

- `pages` (Array<number | 'ellipsis'>): An array representing the list of pages to display, including ellipsis placeholders for truncated pages.
- `currentPage` (number): The current active page.
- `totalPages` (number): The total number of pages calculated from `totalItems` and `itemsPerPage`.
- `hasPrevious` (boolean): `true` if there is a previous page.
- `hasNext` (boolean): `true` if there is a next page.
- `nextPage` (number | null): The next page number, or `null` if there is no next page.
- `previousPage` (number | null): The previous page number, or `null` if there is no previous page.

## License

This project is licensed under the MIT License.
