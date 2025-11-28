/**
 * @fileoverview main js for application
 */

import { generateCardHtml } from './card-template.js';
import { handleCardClick, handleModalClose } from './modal.js';

const URL_BASE = "https://pokeapi.co/api/v2/pokemon/";
const CARDS_TOTAL = 30;
const CARD_SCHEMA = {
    id: "na",
    name: "na",
    img: "na",
    height: "na",
    weight: "na",
    baseExp: "na"
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
 * Render cards and bind event listeners
 *
 * @function renderCards
 * @param {array} pokeData - json response from API
 * @returns {void}
 */
const renderCards = (pokeData) => {
    const generatedHtml = generateCards(pokeData);
    $('#cardGrid').html(generatedHtml);

    bindEventListeners();
};


/**
 * Fetches Data from API endpoint.
 *
 * @param {string} url URL string
 * @returns {string} The parsed json.
 */
const fetchData = async (url) => {
    try {
        const res = await fetch(url);
        const data = await res.json(); // step for parsing byte stream to json
        return data;
    } catch (err) {
        console.error("Fetch failed:", err);
        return null;
    }
};


/**
 * Fetches data from API and composes cards array (data of all cards)
 *
 * @returns {array} The cards array
 */
const composeCardData = async () => {
    //let htmlContent = "";

    let cards = [];
    for (let id = 1; id <= CARDS_TOTAL; id++) {

        let currentUrl = `${URL_BASE}` + id;
        const res = await fetchData(currentUrl); // Fetches 1st level json
        if (!res) continue; // Security check
        
        // A json counts as one line ;-)
        let cardProps = { 
            'id': id,
            'name': res.name.toUpperCase(),
            'img': res.sprites.front_shiny,
            'height': res.height,
            'weight': res.weight,
            'baseExp': res.base_experience
        }

        cardProps = { ...CARD_SCHEMA, ...cardProps} // 
        cards.push(cardProps);
        // toDO: reduce line of function: cardProps assignment in sep function
        //htmlContent += generateCardHtml(id)
    }

    return cards;
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

    composeCardData();

    //renderCards(pokeData);
});