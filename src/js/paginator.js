// paginator.js

// PAGINATION
export const PAGE_CARDS = 30;
export const TOTAL_PAGES = Math.ceil(1025 / PAGE_CARDS);
const INNER_CIRCLE = 7;
const OFFSET = Math.floor(INNER_CIRCLE / 2);

/**
 * Creates a single list item element for pagination (li).
 * @loc 9
 * @param {string|number} label - The text or HTML content for the link.
 * @param {number} page - The target page number for the data attribute.
 * @param {boolean} [disabled=false] - Whether the button is disabled.
 * @param {boolean} [active=false] - Whether this is the currently active page.
 * @returns {HTMLLIElement} The created li-element.
 */
export const createPageItem = (label, page, disabled = false, active = false) => {
    const li = document.createElement("li");
    li.className = disabled ? "disabled" : active ? "active" : "waves-effect";

    const a = document.createElement("a");
    a.href = "#!";
    if (!disabled && page !== null) a.dataset.page = page;
    a.innerHTML = label;
    li.appendChild(a);

    return li;
};


/**
 * Computes the inner circle window for pagination.
 * @loc 14
 * @param {number} page - The target page number for the data attribute.
 * @returns {json} {start: start, end: end} - JSON that contains start and end.
 */
export const computeWindow = (page) => {
    let start = Math.max(2, page - OFFSET);
    let end = Math.min(TOTAL_PAGES - 1, page + OFFSET);

    // Edge case: if page is at the very beginning
    if (page <= INNER_CIRCLE + 1 - OFFSET) {
        end = Math.min(TOTAL_PAGES - 1, INNER_CIRCLE + 1); // grow to 10
    }

    // Edge case: start too small
    if (start < 2) {
        end = Math.min(TOTAL_PAGES - 1, INNER_CIRCLE);
        start = 2;
    }

    // Edge case: end too large
    if (page >= TOTAL_PAGES - INNER_CIRCLE + OFFSET) {
        start = Math.max(2, TOTAL_PAGES - INNER_CIRCLE);   // grow backward
        end = TOTAL_PAGES - 1;
    }

    return { start: start, end: end };
};


/**
 * Renders left edge for pagination.
 * @loc 3
 * @param {CallableFunction} add - Callable that inherits createPageItem(label, value, disable, active)
 * @returns {json} {start: start, end: end} - JSON that contains start and end.
 */
export const renderLeftEdge = (add, page, start) => {
    // args: label, value, disable, active; active defaults to false
    add('<i class="material-icons">chevron_left</i>', Math.max(1, page - 1), page === 1);

    add(1, 1, false, page === 1); // 1
    if (start > 2) add("…", null, true); // ...
};


/**
 * Renders carousel for pagination.
 * @loc 1
 * @param {CallableFunction} add - Callable that inherits createPageItem(label, value, disable, active)
 * @returns {json} {start: start, end: end} - JSON that contains start and end.
 */
export const renderWindow = (add, page, start, end) => {
    // args: label, value, disable, active
    for (let i = start; i <= end; i++) add(i, i, false, i === page);
};


/**
 * Renders carousel for pagination.
 * @loc 3
 * @param {CallableFunction} add - Callable that inherits createPageItem(label, value, disable, active)
 * @returns {json} {start: start, end: end} - JSON that contains start and end.
 */
export const renderRightEdge = (add, page, start, end) => {
    // args: label, value, disable, active; end defaults to false
    if (end < TOTAL_PAGES - 1) add("…", null, true); // ...

    add(TOTAL_PAGES, TOTAL_PAGES, false, page === TOTAL_PAGES); // 35
    add('<i class="material-icons">chevron_right</i>', Math.min(TOTAL_PAGES, page + 1), page === TOTAL_PAGES);
};
