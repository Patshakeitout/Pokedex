/**
 * @fileoverview main.js for application
 */

import { renderSpinner, fetchData, validateSchema } from './utils/helpers.js';
import { generateSingleCardHtml } from './card.js';
import { handleCardClick, changeModal } from './modal.js';
import {
    createPageItem, computeWindow, renderLeftEdge, renderWindow,
    renderRightEdge, PAGE_CARDS, TOTAL_PAGES
} from './paginator.js'

const URL_BASE = "https://pokeapi.co/api/v2/pokemon/";
let cards = [];

// SCHEMA
const CARD_SCHEMA = {
    id: "number",
    name: "string",
    img: "string",
    types: ["string"],
    height: "number",
    weight: "number",
    base_experience: ["object"],
    abilities: ["object"],
    moves: ["object"],
    stats: ["object"]
};


/**
 * Inits the app, sets up Materialize Modals
 *
 * @returns {void}
 */
const initApp = async () => {
    cards = await composeCardData(1);
    renderCards(cards);
    renderPagination(1);

    return cards;
};


/**
 * Renders cards and bind event listeners with arg: cards
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
    bindListeners(cards);
}


/**
 * Fetches data from API and returns json response
 * 
 * @loc
 * @param {pageNumber} - The page number from pagination or page 1 to be rendered.
 * @returns {array} - The cards array.
 */
const composeCardData = async (pageNumber) => {
    renderSpinner();

    cards = [];
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
        id: id,
        name: res.name.toUpperCase(),
        img: res.sprites.front_shiny,
        types: parsePokeTypes(res.types),
        height: res.height * 10,
        weight: res.weight / 10,

        base_experience: res.abilities,
        abilities: res.abilities,
        moves: res.moves,
        stats: res.stats
    }
    cardProps = validateSchema(CARD_SCHEMA, cardProps) // schema validation

    return cardProps;
}


/**
 * Binds all necessary event handlers with availability of cards data.
 * * it uses Event Delegation on the '#cardGrid' element because the 
 * card content is dynamically rendered.
 * * it uses Event Delegation on the '#cardModal' element because the 
 * modal content is dynamically rendered.
 *
 * @function bindListeners
 * @loc 
 * @param {cards} - The Poké cards json-array.
 * @returns {void}
 */
const bindListeners = (cards) => {
    document.querySelector('#cardGrid').addEventListener('click', e => {
        const card = e.target.closest('.card');
        if (!card) return;
        handleCardClick(e, cards);
    });

    document.querySelector('.modal').addEventListener('click', (e) => {
        const cardIdText = document.querySelector('.modal').querySelector('#card-id').textContent;
        const cardId = parseInt(cardIdText.replace("#", ""), cardIdText);
        const prevBtn = e.target.closest('#prev');
        const nextBtn = e.target.closest('#next');

        if (prevBtn || nextBtn) {
            const newId = cardId + (prevBtn ? -1 : +1);
            const newCard = cards.find(c => c.id === newId);
            changeModal(newCard);
        }
    });
};


/**
 * Handles click events on pagination links, fetches new data, 
 * and re-renders the cards and the pagination UI.
 * @loc 11
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
    cards = [];
    cards = await composeCardData(pageNumber);
    document.getElementById('search').addEventListener("click", () => filterPokeCards(cards));

    renderCards(cards);

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
    // foreach class
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
 * Renders subset of Poke card data given by search string
 * 
 * @loc 8
 * @param {array} pokeData 
 */
function filterPokeCards(pokeData) {
    const text = document.getElementById("input-search").value.trim().toLowerCase();
    if (text.length < 3) {
        M.toast({ html: 'Please type at least 3 characters!' });
        return;
    }

    const subset = pokeData.filter(card => card.name.toLowerCase().includes(text));
    const subsetLength = subset.length;
    if (subsetLength == 0) M.toast({ html: 'No Pokèmons with that name found' });

    renderCards(subset);
}


// Entire app logic
$(document).ready(async () => {
    cards = await initApp();

    $(".pagination").off('click', 'li.waves-effect a');
    $(".pagination").on('click', 'li.waves-effect a', handlePaginationClick);

    document.getElementById('search').addEventListener("click", () => filterPokeCards(cards));

});