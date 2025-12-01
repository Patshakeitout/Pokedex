/**
 * @fileoverview main js for application
 */

import { fetchData, validateSchema } from './utils/helpers.js';
import { generateSingleCardHtml } from './card.js';
import { handleCardClick, handleModalClose } from './modal.js';

const URL_BASE = "https://pokeapi.co/api/v2/pokemon/";
const CARDS_TOTAL = 30;
const CARD_SCHEMA = {
    id: "number",
    name: "string",
    img: "string",
    types: ["string"],
    height: "number",
    weight: "number"
};


/**
 * Inits the app, sets up Materialize Modals
 *
 * @function initializeApp
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
    let allCardsHtml = '';

    // 
    for (let card of cards) {
        allCardsHtml += generateSingleCardHtml(card);
        bindEventListeners();
    };

    // DOM injection
    $('#cardGrid').append(allCardsHtml);
}



/**
 * Fetches data from API and returns json response
 *
 * @function composeCardData
 * @returns {array} The cards array
 */
const composeCardData = async () => {
    let cards = [];
    for (let id = 1; id <= CARDS_TOTAL; id++) {
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
    // Event Delegation: Open Modal
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
        $li.css({ 'background-color': typeColor});
    });
};


// Entire app logic
$(document).ready(async () => {
    initApp();

    // Aggregate Pokè data
    let cards = await composeCardData();

    // Rendering
    renderCards(cards);
});