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
let isLoading = false;
const CARD_SCHEMA = {
    id: "number",
    name: "string",
    imgDefault: "string",
    imgBack: "string",
    img: "string",
    types: ["string"],
    height: "number",
    weight: "number",
    base_experience: ["object"],
    abilities: ["object"],
    moves: ["object"],
    stats: ["object"]
};


$(document).ready(async () => {
    cards = await initApp();

    $(".pagination").off('click', 'li.waves-effect a');
    $(".pagination").on('click', 'li.waves-effect a', handlePaginationClick);
});


/**
 * Inits app
 * @loc 5
 * @async
 * @function initApp
 * @returns {Promise<Card[]>} Resolves with the full list of cards of initial page 1.
 */
const initApp = async () => {
    bindListeners();

    cards = await composeCardData(1);
    renderCards(cards);
    renderPagination(1);

    return cards;
};


/**
 * Renders cards
 * @loc 6
 * @function renderCards
 * @param {array} cards - Json Array of cards 
 */
const renderCards = (cards) => {
    $('#cardGrid').empty();
    let allCardsHtml = '';

    for (let card of cards) {
        allCardsHtml += generateSingleCardHtml(card);
    };

    $('#cardGrid').append(allCardsHtml);
}


/**
 * Fetches data from API and returns json response.
 * @loc 11
 * @async
 * @function composeCardData
 * @param {pageNumber} - The page number from pagination or page 1 to be rendered.
 * @returns {array} - Array of Pokémons
 */
const composeCardData = async (pageNumber) => {
    renderSpinner();

    cards = [];
    let firstId = PAGE_CARDS * (pageNumber - 1) + 1;
    let lastId = (pageNumber === TOTAL_PAGES) ? 1025 : PAGE_CARDS * pageNumber;

    for (let id = firstId; id <= lastId; id++) {
        let currentUrl = `${URL_BASE}` + id;
        const res = await fetchData(currentUrl);
        if (!res) continue;

        cards.push(createCardProps(id, res));
    }

    return cards;
}



/**
 * Parses res.types from API response to retrieve the Poké type names.
 *
 * @loc 2
 * @function parsePokeTypes
 * @param typesArray - Types key-value pair from response
 * @returns {array} The array of Pokè types
 */
const parsePokeTypes = (typesArray) => {
    if (!Array.isArray(typesArray)) return [];
    return typesArray.map(t => t.type.name);
}


/**
 * Creates validated card properties from API response.
 *
 * @loc 3
 * @function createCardProps
 * @param id - The id of card or Pokèmon
 * @param res - Response from API
 * @returns {array} The cards array
 */
const createCardProps = (id, res) => {
    let cardProps = {
        id: id,
        name: res.name.toUpperCase(),
        imgDefault: res.sprites.front_default,
        imgBack: res.sprites.back_default,
        img: res.sprites.front_shiny,
        types: parsePokeTypes(res.types),
        height: res.height * 10,
        weight: res.weight / 10,

        base_experience: res.abilities,
        abilities: res.abilities,
        moves: res.moves,
        stats: res.stats
    }
    cardProps = validateSchema(CARD_SCHEMA, cardProps);
    return cardProps;
}


/**
 * Binds all grid event handlers with availability of cards data.
 * * It uses Event Delegation on the '#cardGrid' element because the 
 * card content is dynamically rendered.
 ** @function bindGridEvents
 * @loc 5
 * @param {cards} - The Poké cards json-array.
 */
const bindGridEvents = () => {
    document.querySelector('#cardGrid').addEventListener('click', e => {
        const card = e.target.closest('.card');
        if (!card) return;
        handleCardClick(e, cards);
    });
};


/**
 * Binds all modal event handlers with availability of modal data.
 * * It uses Event Delegation on the '#cardModal' element because the 
 * modal content is dynamically rendered.
 *
 ** @function bindModalEvents
 * @loc 14
 */
const bindModalEvents = () => {
    document.querySelector('.modal').addEventListener('click', (e) => {
        const cardIdText = document.querySelector('.modal').querySelector('#card-id').textContent;
        const cardId = parseInt(cardIdText.replace("#", ""), 10);
        const prevBtn = e.target.closest('#prev'); const nextBtn = e.target.closest('#next');

        if (prevBtn || nextBtn) {
            const newId = cardId + (prevBtn ? -1 : +1);
            const newCard = cards.find(c => c.id === newId);

            if (newCard) {
                changeModal(newCard);
            } else {
                console.warn("Card not found in current page data");
            }
        }
    });
};


/**
 * Binds all search event handlers.
 *
 ** @function bindSearchEvents
 * @loc 13
 */
const bindSearchEvents = () => {
    const btnSearch = document.getElementById('btn-search');
    if (btnSearch) {
        btnSearch.addEventListener("click", () => filterPokeCards(cards));
    }

    const input = document.getElementById('input-search');
    if (input) {
        input.addEventListener("keypress", e => {
            if (e.key === 'Enter') {
                btnSearch.click();
                e.preventDefault();
            }
        });
    }

    const btnClose = document.getElementById('btn-close');
    if (btnClose) {
        btnClose.addEventListener('click', () => {
            input.value = '';
            renderCards(cards);
        });
    }
};


/**
 * Binds all search event handlers.
 *
 ** @function bindCloseEvents
 * @loc 7
 */
const bindCloseEvents = () => {
    const btnClose = document.getElementById('btn-close');
    if (btnClose) {
        btnClose.addEventListener('click', () => {
            input.value = '';
            renderCards(cards);
        });
    }
};


/**
* Binds necessary event handlers.
** Grid, Modal, Search, Close
** @function bindListeners 
* @loc 4
*/
const bindListeners = () => {
    bindGridEvents();
    bindModalEvents();
    bindSearchEvents();
    bindCloseEvents();
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

    if (isLoading) {
        console.log("Loading in progress, click ignored.");
        return;
    }

    const aTag = event.target.closest('a');
    const pageNumber = +aTag.getAttribute('data-page');

    if (isNaN(pageNumber) || pageNumber < 1) {
        return;
    }

    isLoading = true;
    $('li.waves-effect').addClass('disabled').removeClass('waves-effect');
    $(aTag).parent('li').addClass('active').siblings().removeClass('active');

    try {
        cards = await composeCardData(pageNumber);
        renderCards(cards);
        renderPagination(pageNumber);
    } catch (err) {
        console.error(err);
    } finally {
        isLoading = false;
    }
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
    const uls = document.querySelectorAll(".pagination");

    const { start, end } = computeWindow(page);

    uls.forEach(ul => {
        ul.innerHTML = '';

        const add = (label, value, disabled, active) =>
            ul.appendChild(createPageItem(label, value, disabled, active));

        renderLeftEdge(add, page, start, end);
        renderWindow(add, page, start, end);
        renderRightEdge(add, page, start, end);
    });
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