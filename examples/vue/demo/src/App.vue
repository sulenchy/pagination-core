<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { createPagination, type PaginationState } from 'pagination-core';

// Mock data: An array of 100 items
const items = Array.from({ length: 100 }, (_, i) => `Item #${i + 1}`);

const paginationState = ref<PaginationState | null>(null);

// --- pagination-core usage ---
const pagination = createPagination({
  totalItems: items.length,
  itemsPerPage: 10,
  onStateChange: (newState) => {
    paginationState.value = newState;
  },
});

// Set the initial state on component mount
onMounted(() => {
  paginationState.value = pagination.initialState;
});

// --- Derived State ---
const currentItems = computed(() => {
  if (!paginationState.value) return [];
  const startIndex = (paginationState.value.currentPage - 1) * 10;
  const endIndex = startIndex + 10;
  return items.slice(startIndex, endIndex);
});
</script>

<template>
  <div class="app">
    <h1>pagination-core Vue Demo</h1>

    <div v-if="paginationState">
      <!-- Display the list of items for the current page -->
      <div class="items-list">
        <div v-for="item in currentItems" :key="item" class="item">
          {{ item }}
        </div>
      </div>

      <!-- --- Pagination Controls --- -->
      <div class="pagination-controls">
        <!-- Previous Page Button -->
        <button
          @click="pagination.previousPage"
          :disabled="!paginationState.hasPrevious"
        >
          Previous
        </button>

        <!-- Page Number Buttons -->
        <template v-for="(page, index) in paginationState.pages" :key="index">
          <button
            v-if="typeof page === 'number'"
            @click="pagination.goToPage(page)"
            :class="{ active: page === paginationState.currentPage }"
          >
            {{ page }}
          </button>
          <span v-else class="ellipsis">...</span>
        </template>

        <!-- Next Page Button -->
        <button
          @click="pagination.nextPage"
          :disabled="!paginationState.hasNext"
        >
          Next
        </button>
      </div>

      <!-- --- Display Pagination Info --- -->
      <div class="pagination-info">
        <p>Current Page: {{ paginationState.currentPage }}</p>
        <p>Total Pages: {{ paginationState.totalPages }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
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