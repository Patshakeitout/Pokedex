/**
 * @fileoverview main js for application
 */

import { generateCardHtml } from './card-template.js';
import { handleCardClick, handleModalClose } from './modal.js';

const CARDS_TOTAL = 30;
const URL_BASE = "https://pokeapi.co/api/v2/pokemon/";


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
 * Generates the full HTML markup for the card grid by looping a specified number of times.
 *
 * @returns {string} The aggregated HTML string containing all rendered cards.
 */
const generateCards = async () => {
    let htmlContent = "";

    for (let id = 1; id <= CARDS_TOTAL; id++) {

        let currentUrl = `${URL_BASE}` + id; 
        const currentPokeData = await fetchData(currentUrl); // Fetches json
        if (!currentPokeData) continue; // Security check
        
        let name = currentPokeData.name;
        //const pokeImage = currentPokeData.sprites.front_shiny      

        htmlContent += generateCardHtml(id, name, pokeImage)
    }

    return htmlContent;
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

    generateCards();

    //renderCards(pokeData);
});