
# Project: pagination-core

This document summarizes the key aspects of the `pagination-core` project.

## Project Overview

- **Purpose**: A lightweight, headless, UI-agnostic pagination logic library.
- **Technology**: Written in TypeScript, distributed as an ES Module.
- **Dependencies**: Zero production dependencies. Uses `vitest` for testing.
- **Core Concept**: The library provides the pagination logic (state and methods) but does not render any UI. It uses an `onStateChange` callback to provide the state to the user's rendering framework.

## Core API

The main export is the `createPagination` function.

### `createPagination(options)`

- **`options`**:
    - `totalItems: number`: Total number of items to paginate.
    - `itemsPerPage: number`: Number of items per page.
    - `initialPage?: number`: The starting page (defaults to `1`).
    - `siblingCount?: number`: Number of page links to show around the current page (defaults to `2`).
    - `onStateChange: (state: PaginationState) => void`: Callback function triggered on state changes.

- **Returns**: An object with:
    - `initialState: PaginationState`: The initial state for the first render.
    - `goToPage(page: number)`: Function to navigate to a specific page.
    - `nextPage()`: Function to go to the next page.
    - `previousPage()`: Function to go to the previous page.

### `PaginationState` Object

This is the state object passed to `onStateChange`.

- `pages: Array<number | 'ellipsis'>`: An array of page numbers and ellipsis markers for rendering.
- `currentPage: number`: The current page number.
- `totalPages: number`: The total number of pages.
- `hasPrevious: boolean`: Flag indicating if a previous page exists.
- `hasNext: boolean`: Flag indicating if a next page exists.
- `nextPage: number | null`: The next page number.
- `previousPage: number | null`: The previous page number.

## Project Structure

- `src/`: Contains the core TypeScript source code (`createPagination.ts`, `types.ts`).
- `dist/`: The compiled JavaScript output.
- `tests/`: Contains unit tests using `vitest`.
- `examples/`: Contains demonstration applications for:
    - React
    - Svelte
    - Vue
    - Vanilla JavaScript

## Development Scripts

- `npm run build`: Compiles the TypeScript code using `tsc`.
- `npm run test`: Runs tests with `vitest`.
- `npm run coverage`: Runs tests with coverage reporting.


