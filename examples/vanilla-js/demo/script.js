import { createPagination } from './node_modules/pagination-core/dist/createPagination.js';

// Mock data: An array of 100 items
const items = Array.from({ length: 100 }, (_, i) => `Item #${i + 1}`);

// Get UI elements
const itemsList = document.getElementById('items-list');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const pageNumbersContainer = document.getElementById('page-numbers');
const currentPageSpan = document.getElementById('current-page');
const totalPagesSpan = document.getElementById('total-pages');

let paginatorInstance; // To hold the paginator object

// Function to render items for the current page
function renderItems(currentPageItems) {
    console.log('Rendering items for current page:', currentPageItems);
    itemsList.innerHTML = '';
    currentPageItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.textContent = item;
        itemsList.appendChild(itemDiv);
    });
}

// Function to render pagination controls
function renderPaginationControls(state) {
    pageNumbersContainer.innerHTML = '';
    state.pages.forEach(page => {
        if (page === 'ellipsis') {
            const ellipsisSpan = document.createElement('span');
            ellipsisSpan.className = 'ellipsis';
            ellipsisSpan.textContent = '...';
            pageNumbersContainer.appendChild(ellipsisSpan);
        } else {
            const pageButton = document.createElement('button');
            pageButton.textContent = page;
            pageButton.className = page === state.currentPage ? 'active' : '';
            pageButton.addEventListener('click', () => {
                paginatorInstance.goToPage(page);
            });
            pageNumbersContainer.appendChild(pageButton);
        }
    });

    prevButton.disabled = !state.hasPrevious;
    nextButton.disabled = !state.hasNext;
    currentPageSpan.textContent = state.currentPage;
    totalPagesSpan.textContent = state.totalPages;
}

// --- pagination-core usage ---
// This function will be called every time the pagination state changes
function onPaginationStateChange(state) {
    // Calculate items to display for the current page
    const startIndex = (state.currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    const currentItems = items.slice(startIndex, endIndex);

    renderItems(currentItems);
    renderPaginationControls(state);
}

// Initialize the paginator
paginatorInstance = createPagination({
    totalItems: items.length,
    itemsPerPage: 10,
    onStateChange: onPaginationStateChange,
});

// Set initial state
onPaginationStateChange(paginatorInstance.initialState);

// Add event listeners for Previous and Next buttons
prevButton.addEventListener('click', () => {
    paginatorInstance.previousPage();
});

nextButton.addEventListener('click', () => {
    paginatorInstance.nextPage();
});
