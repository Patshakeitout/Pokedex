/**
 * @fileoverview main.js for application
 */

import { fetchData, validateSchema } from './utils/helpers.js';
import { generateSingleCardHtml } from './card.js';
import { handleCardClick, handleModalClose } from './modal.js';
import {
    createPageItem, computeWindow, renderLeftEdge, renderWindow,
    renderRightEdge, PAGE_CARDS, TOTAL_PAGES
} from './paginator.js'

const URL_BASE = "https://pokeapi.co/api/v2/pokemon/";
let cards = [];

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
    cards = await composeCardData(1);
    renderCards(cards);
    renderPagination(1);

    $('.modal').modal();
    
    return cards;
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
    bindModalListeners();
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
 * Binds all necessary event handlers to Modals.
 * * it uses Event Delegation on the '#cardGrid' element because the cards 
 * are dynamically rendered.
 *
 * @function bindModalListeners
 * @returns {void}
 */
const bindModalListeners = () => {
    $('#cardGrid').on('click', '.card', handleCardClick);
    $('#modalCloseButton').on('click', handleModalClose);
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
 * @loc 8
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

/**
 * Subsets Poke card data for search string 
 * 
 * @param {array} pokeData 
 */
function filterPokeCards(pokeData) {
    const text = document.getElementById("input-search").value.trim().toLowerCase();
    const subset = pokeData.filter(card => card.name.toLowerCase().includes(text));

    renderCards(subset);
}


// Entire app logic
$(document).ready(async () => {
    cards = await initApp();

    document.getElementById('search').addEventListener("click", () => filterPokeCards(cards));

    $(".pagination").off('click', 'li.waves-effect a');
    $(".pagination").on('click', 'li.waves-effect a', handlePaginationClick);
});