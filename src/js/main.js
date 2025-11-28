/**
 * @fileoverview main js for application
 */

import { generateCardHtml } from './card-template.js';

const TOTAL_CARDS = 30;
const URL_BASE = "https://pokeapi.co/api/v2/";
const URL_OFFSET = "https://pokeapi.co/api/v2/pokemon?limit=30";


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


const fetchOffsetData = async (url, offset = 0) => {

    const fullUrl = `${url}&offset=${encodeURIComponent(offset)}`;

    try {    
        const res = await fetch(fullUrl);
        const data = await res.json(); // step for parsing byte stream to json
        return data.results;
    } catch (err) {
        console.error("Fetch failed:", err);
        return null;
    }
};



/**
 * Generates the full HTML markup for the card grid by looping a specified number of times.
 *
 * @param {array} pokeCardArr - Pokè json-array.
 * @returns {string} The aggregated HTML string containing all rendered cards.
 */
const generateCards = (pokeCardArr) => {
    let htmlContent = "";

    for (let id = 1; id <= TOTAL_CARDS; id++) {
        const currentPokeData = pokeCardArr[id-1];

        // Security check
        if (!currentPokeData) continue;

        htmlContent += generateCardHtml(id, currentPokeData.name)
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


/**
 * Handles the click event on a card element within the grid.
 * * It extracts data attributes from the clicked card, populates the modal content,
 * * and then opens the Materialize modal.
 *
 * @param {Event} e - The jQuery click event object.
 * @returns {void}
 */
const handleCardClick = (e) => {
    const modalData = $(e.currentTarget).data();

    $('#modalTitle').text(modalData.t);
    $('#modalSubtitle').text(`ID: ${modalData.id} | ${modalData.sub}`);
    $('#modalBody').text(modalData.body || 'No further text available.');

    // Opens the modal using the Materialize/jQuery API
    $('#cardModal').modal('open');
};


/**
 * Closes the Materialize modal window.
 *
 * @function handleModalClose
 * @returns {void}
 */
const handleModalClose = () => {
    $('#cardModal').modal('close');
};


// Entire app logic
$(document).ready(async () => {
    initApp();

    let pokeData = await fetchOffsetData(URL_OFFSET);
    renderCards(pokeData);
});