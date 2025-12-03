/**
 * @fileoverview main js for application
 */

import { fetchData, validateSchema } from './utils/helpers.js';
import { generateSingleCardHtml } from './card.js';
import { handleCardClick, handleModalClose } from './modal.js';

const URL_BASE = "https://pokeapi.co/api/v2/pokemon/";
const URL_LIMIT1 = "https://pokeapi.co/api/v2/pokemon?limit=1";
const PAGE_CARDS = 30;

// PAGINATION
const TOTAL_PAGES = Math.ceil(1025 / PAGE_CARDS);
const INNER_CIRCLE = 9;
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
    // 1. Determine Class Name
    const className = disabled ? "disabled" : active ? "active" : "waves-effect";
    // 2. Create Elements
    const li = document.createElement("li");
    const a = document.createElement("a");
    li.className = className; // Sets class on the <li>
    a.setAttribute("href", "#!");
    a.setAttribute("data-page", page);

    a.innerHTML = label; // Uses innerHTML to allow for <i> tags (icons)

    // 4. Assemble and Return
    li.appendChild(a);
    return li;
};


/**
 * Renders the smart windowed pagination into the element with class .pagination.
 * @param {number} currentPage - The currently active page number.
 * @returns {void}
 */
const renderPagination = (currentPage) => {
    // Select the first element with the class .pagination
    const ul = document.querySelector(".pagination"); 
    
    // Clear existing content (safer way than innerHTML = "")
    ul.innerHTML = ''; 

    // Prev
    ul.appendChild(createPageItem('<i class="material-icons">chevron_left</i>', currentPage - 1, currentPage === 1)); // 3
    
    // Calculate the visible window start and end points
    let startPage = Math.max(2, currentPage - OFFSET); // 5
    let endPage = Math.min(TOTAL_PAGES - 1, currentPage + OFFSET); // 6

    // Adjust clamping to ensure the window size (INNER_CIRCLE) is maintained
    if (currentPage < INNER_CIRCLE) endPage = Math.min(TOTAL_PAGES - 1, INNER_CIRCLE); // 8
    if (currentPage > TOTAL_PAGES - OFFSET) startPage = TOTAL_PAGES - INNER_CIRCLE + 1; // 9

    // First page & Left Ellipsis
    ul.appendChild(createPageItem(1, 1, false, 1 === currentPage)); // 11
    if (startPage > 2) ul.appendChild(createPageItem('...', startPage - 1, true)); // 12
    
    // Render the centered window
    for (let i = startPage; i <= endPage; i++) { // 14
        ul.appendChild(createPageItem(i, i, false, i === currentPage));
    }

    // Last page & Right Ellipsis
    if (endPage < TOTAL_PAGES - 1) ul.appendChild(createPageItem('...', endPage + 1, true));
    if (TOTAL_PAGES > 1) ul.appendChild(createPageItem(TOTAL_PAGES, TOTAL_PAGES, false, TOTAL_PAGES === currentPage));

    // Next
    ul.appendChild(createPageItem('<i class="material-icons">chevron_right</i>', currentPage + 1, currentPage === TOTAL_PAGES));
};


// Entire app logic
$(document).ready(async () => {
    initApp();

    // Aggregate Pokè data
    let cards = await composeCardData(1);

    // Rendering
    renderCards(cards);

    // Pagination nav
    renderPagination(1);

    // 1. Unbind any previous events to prevent duplicate handlers
    $(".pagination").off('click', 'li.waves-effect a');

    // 2. Bind the click event using delegation on the <a> children
    $(".pagination").on('click', 'li.waves-effect a', handlePaginationClick);

});