/**
 * @fileoverview main js for application
 */

import { fetchData, validateSchema } from './utils/helpers.js';
import { generateSingleCardHtml } from './card-template.js';
import { handleCardClick, handleModalClose } from './modal.js';

const URL_BASE = "https://pokeapi.co/api/v2/pokemon/";
const CARDS_TOTAL = 30;
const CARD_SCHEMA = {
    id: "number",
    name: "string",
    img: "string",
    height: "number",
    weight: "number",
    baseExp: "number"
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
 * Fetches data from API and returns json response
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
        'height': res.height,
        'weight': res.weight,
        'baseExp': res.base_experience
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


// Entire app logic
$(document).ready(async () => {
    initApp();

    // Aggregate Pokè data
    let cards = await composeCardData();

    // Rendering
    renderCards(cards);
});