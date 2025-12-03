/**
 * @fileoverview main js for application
 */

import { fetchData, validateSchema } from './utils/helpers.js';
import { generateSingleCardHtml } from './card.js';
import { handleCardClick, handleModalClose } from './modal.js';

const URL_BASE = "https://pokeapi.co/api/v2/pokemon/";
let cards = [];
const PAGE_CARDS = 30;

// PAGINATION
const TOTAL_PAGES = Math.ceil(1025 / PAGE_CARDS);
const INNER_CIRCLE = 7;
const OFFSET = Math.floor(INNER_CIRCLE / 2);

// SCHEME
const CARD_SCHEMA = {
    id: "number",
    name: "string",
    img: "string",
    types: ["string"],
    height: "number",
    weight: "number"
};
/*
const MODEL_SCHEMA = {

}
*/


/**
 * Inits the app, sets up Materialize Modals
 *
 * @returns {void}
 */
const initApp = async () => {
    $('.modal').modal();
};


/**
 * Renders cards and bind event listeners
 *
 * @function renderCards
 * @param {array} cards - Json Array of cards 
 * @returns {void}
 */
const renderCards = (cards) => {
    $('#cardGrid').empty();
    let allCardsHtml = '';

    for (let card of cards) {
        allCardsHtml += generateSingleCardHtml(card);
    };

    // DOM injection
    $('#cardGrid').append(allCardsHtml);
    bindEventListeners();
}


/**
 * Fetches data from API and returns json response
 *
 * @param {number} - The offset of rendered page (pagination).
 * @returns {array} - The cards array.
 */
const composeCardData = async (pageNumber) => {
    let cards = [];
    let firstId = PAGE_CARDS * (pageNumber - 1) + 1;
    let lastId = (pageNumber === TOTAL_PAGES) ? 1025 : PAGE_CARDS * pageNumber;

    for (let id = firstId; id <= lastId; id++) {
        let currentUrl = `${URL_BASE}` + id;
        const res = await fetchData(currentUrl); // Fetches 1st level json
        if (!res) continue; // Security check

        cards.push(createCardProps(id, res));
    }

    return cards;
}



/**
 * Parses res.types from API response to retrieve the Poké type names
 *
 * @function parsePokeTypes
 * @param typesArray - Types key-value pair from response
 * @returns {array} The array of Pokè types
 */
const parsePokeTypes = (typesArray) => {
    if (!Array.isArray(typesArray)) return [];
    return typesArray.map(t => t.type.name);
}


/**
 * Creates validated card properties from API response
 *
 * @function createCardProps
 * @param id - The id of card or Pokèmon
 * @param res - Response from API
 * @returns {array} The cards array
 */
const createCardProps = (id, res) => {
    // A json counts as one line ;-)
    let cardProps = {
        'id': id,
        'name': res.name.toUpperCase(),
        'img': res.sprites.front_shiny,
        'types': parsePokeTypes(res.types),
        'height': res.height * 10,
        'weight': res.weight / 10
    }
    cardProps = validateSchema(CARD_SCHEMA, cardProps) // schema validation

    return cardProps;
}


/**
 * Binds all necessary event handlers to the relevant DOM elements.
 * * * It uses Event Delegation on the '#cardGrid' element because the cards 
 * * are dynamically rendered.
 *
 * @function bindEventListeners
 * @returns {void}
 */
const bindEventListeners = () => {
    // Event Delegation: Modal
    $('#cardGrid').on('click', '.card', handleCardClick);
    $('#modalCloseButton').on('click', handleModalClose);
};


// Function takes the main card element (jQuery object) and the types array
const applyCardTypeBackground = ($card, types) => {
    const type1 = types[0];
    const type2 = types[1] || type1;
    const color1 = TYPE_COLORS[type1] || '#777777';
    const color2 = TYPE_COLORS[type2] || color1;

    // 1. Set CSS Variables on the main card for the background gradient
    $card.css({ '--color-primary': color1, '--color-secondary': color2 });

    // 2. Style individual type pills (NO gradient here, only solid color)
    $card.find('.types-vertical li').each(function () {
        const $li = $(this);
        const typeName = $li.text();
        const typeColor = TYPE_COLORS[typeName] || '#777777';

        // Set background and text color for the pill
        $li.css({ 'background-color': typeColor });
    });
};


/**
 * Handles click events on pagination links, fetches new data, 
 * and re-renders the cards and the pagination UI.
 * @loc 10
 * @param {Event} event - The click event object.
 * @returns {void}
 */
const handlePaginationClick = async (event) => {
    event.preventDefault();

    // 1. Use .target due to event delegation
    const aTag = event.target.closest('a');

    // 2. Extract page number from the data-page attribute (most reliable)
    const pageNumber = +aTag.getAttribute('data-page');

    // 3. Validation Check (Stops execution for non-numeric links like "..." or icons without data)
    if (isNaN(pageNumber) || pageNumber < 1) {
        console.warn(`Click on non-navigable element ignored: ${aTag.textContent}`);
        return;
    }
    // 4. Aggregate Pokè data for the new page
    let newCards = await composeCardData(pageNumber);
    renderCards(newCards);

    // 5. Rerender pagination to update active state
    renderPagination(pageNumber);
};


/**
 * Creates a single list item element for pagination (li).
 * @loc 9
 * @param {string|number} label - The text or HTML content for the link.
 * @param {number} page - The target page number for the data attribute.
 * @param {boolean} [disabled=false] - Whether the button is disabled.
 * @param {boolean} [active=false] - Whether this is the currently active page.
 * @returns {HTMLLIElement} The created li-element.
 */
const createPageItem = (label, page, disabled = false, active = false) => {
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
const computeWindow = (page) => {
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
const renderLeftEdge = (add, page, start) => {
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
const renderWindow = (add, page, start, end) => {
    // args: label, value, disable, active
    for (let i = start; i <= end; i++) add(i, i, false, i === page);
};


/**
 * Renders carousel for pagination.
 * @loc 3
 * @param {CallableFunction} add - Callable that inherits createPageItem(label, value, disable, active)
 * @returns {json} {start: start, end: end} - JSON that contains start and end.
 */
const renderRightEdge = (add, page, start, end) => {
    // args: label, value, disable, active; end defaults to false
    if (end < TOTAL_PAGES - 1) add("…", null, true); // ...

    add(TOTAL_PAGES, TOTAL_PAGES, false, page === TOTAL_PAGES); // 35
    add('<i class="material-icons">chevron_right</i>', Math.min(TOTAL_PAGES, page + 1), page === TOTAL_PAGES); 
};


/**
 * Renders the sliding carousel paginator into the element with class .pagination.
 *
 * Visualization for 7 pages in carousel :
 *
 * ```
 * LEFT EDGE:
 * ‹ 1  [2 3 4 5 6 7 8]  …  35 ›
 *
 * CENTER:
 * ‹ 1  …  [9 10 11 12 13 14 15]  …  35 ›
 *
 * RIGHT EDGE:
 * ‹ 1  …  [29 30 31 32 33 34]  35 ›
 * ```
 * 
 * @param {number} page - The currently active page number.
 * @returns {void}
 */
const renderPagination = (page) => {
    const ul = document.querySelector(".pagination");
    ul.innerHTML = ''; // Clear ul content

    const add = (label, value, disabled, active) => 
        ul.appendChild(createPageItem(label, value, disabled, active));

    // Computes inner circle window
    const { start, end } = computeWindow(page);

    renderLeftEdge(add, page, start, end);
    renderWindow(add, page, start, end);
    renderRightEdge(add, page, start, end);
};



// Entire app logic
$(document).ready(async () => {
    initApp();

    // Aggregate Pokè data
    cards = await composeCardData(1);

    // Rendering
    renderCards(cards);

    // Pagination nav
    renderPagination(1);

    // 1. Unbind any previous events to prevent duplicate handlers
    $(".pagination").off('click', 'li.waves-effect a');

    // 2. Bind the click event using delegation on the <a> children
    $(".pagination").on('click', 'li.waves-effect a', handlePaginationClick);

    // 3. Event binding for Search button
    //--todo
});