/**
 * @fileoverview main js for application
 */

const TEMPLATE_FILE = './src/templates/card-template.html';
const TOTAL_CARDS = 30;

/**
 * Initializes the app.
 * Sets up Materialize Modals and starts loading the external card template.
 *
 * @function initializeApp
 * @returns {void}
 */
const initializeApp = () => {
    $('.modal').modal();
    renderTemplate();
};

/**
 * Main function 
 * Asynchronously loads the external card template and handles the rendering process.
 *
 * @function renderTemplate
 * @returns {void}
 */
const renderTemplate = () => {
    $.get(TEMPLATE_FILE)
        .done((rawTemplate) => {
            const template = rawTemplate.trim();
            const generatedHtml = generateGridHtml(template);
            
            $('#cardGrid').html(generatedHtml);
            bindEventListeners();
        })
        .fail(() => {
            console.error(`Error with loading template ${TEMPLATE_FILE}.`);
            $('#cardGrid').html('<p class="red-text">Loading of Card-template failed.</p>');
        });
};


/**
 * Generates the full HTML markup for the card grid by looping a specified number of times.
 *
 * @param {string} templateMarkup - The raw HTML string of a single card template.
 * @returns {string} The aggregated HTML string containing all rendered cards.
 */
const generateGridHtml = (templateMarkup) => {
    let html = '';
    
    // The constant TOTAL_CARDS must be defined elsewhere in the scope
    for (let i = 1; i <= TOTAL_CARDS; i++) {
        html += populateCard(templateMarkup, i);
    }
    
    return html;
};


/**
 * Populates card (<article>) attributes (e.g., {{ID}}) with the given card ID.
 *
 * @param {string} templateMarkup - The raw HTML string containing the {{ID}} placeholders.
 * @param {number} id - The current numerical ID to replace the placeholders with.
 * @returns {string} The HTML string with all {{ID}} placeholders replaced.
 */
const populateCard = (templateMarkup, id) => {
    return templateMarkup.replace(/{{ID}}/g, id);
};


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


// Starts the entire app logic (initializeApp)
$(document).ready(initializeApp);