<script lang="ts">
  import { createPagination, type PaginationState } from "pagination-core";
  import { onMount } from "svelte";

  // Mock data: An array of 100 items
  const items = Array.from({ length: 100 }, (_, i) => `Item #${i + 1}`);

  let paginationState: PaginationState | null = null;

  // --- pagination-core usage ---
  const pagination = createPagination({
    totalItems: items.length,
    itemsPerPage: 10,
    onStateChange: (newState) => {
      paginationState = newState;
    },
  });

  // Set the initial state on component mount
  onMount(() => {
    paginationState = pagination.initialState;
  });

  // --- Derived State ---
  $: currentItems = paginationState
    ? items.slice(
        (paginationState.currentPage - 1) * 10,
        (paginationState.currentPage - 1) * 10 + 10
      )
    : [];
</script>

<main>
  <h1>pagination-core Svelte Demo</h1>

  {#if paginationState}
    <!-- Display the list of items for the current page -->
    <div class="items-list">
      {#each currentItems as item}
        <div class="item">{item}</div>
      {/each}
    </div>

    <!-- --- Pagination Controls --- -->
    <div class="pagination-controls">
      <!-- Previous Page Button -->
      <button
        on:click={pagination.previousPage}
        disabled={!paginationState.hasPrevious}
      >
        Previous
      </button>

      <!-- Page Number Buttons -->
      {#each paginationState.pages as page}
        {#if typeof page === "number"}
          <button
            on:click={() => pagination.goToPage(page)}
            class:active={page === paginationState.currentPage}
          >
            {page}
          </button>
        {:else}
          <span class="ellipsis">...</span>
        {/if}
      {/each}

      <!-- Next Page Button -->
      <button on:click={pagination.nextPage} disabled={!paginationState.hasNext}>
        Next
      </button>
    </div>

    <!-- --- Display Pagination Info --- -->
    <div class="pagination-info">
      <p>Current Page: {paginationState.currentPage}</p>
      <p>Total Pages: {paginationState.totalPages}</p>
    </div>
  {/if}
</main>

<style>
  main {
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
</style>