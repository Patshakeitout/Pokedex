// modal.js

/**
 * @fileoverview modal js for handling overlay logic
 */

/**
 * Handles the click event on a card element within the grid.
 * * It extracts data attributes from the clicked card, populates the modal content,
 * * and then opens the Materialize modal.
 *
 * @param {Event} event - The card click event object.
 * @returns {void}
 */
export const handleCardClick = (event, cards) => {
    const card = event.target.closest('.card');
    const id = parseInt(card.dataset.id);
    const selectedCard = cards.find(card => card.id === id);
    
    // Fill modal content
    document.querySelector('#modalTitle').textContent = selectedCard.weight;
    document.querySelector('#modalSubtitle').textContent = `ID: ${id}`;
    // document.querySelector('#modalBody').textContent =
    //     body || 'No further text available.';

    // Open Materialize modal
    const modalElem = document.querySelector('#cardModal');
    const modal = M.Modal.getInstance(modalElem) || M.Modal.init(modalElem);
    modal.open();
};


/**
 * Closes the Materialize modal window.
 *
 * @function handleModalClose
 * @returns {void}
 */
export const handleModalClose = () => {
    $('#cardModal').modal('close');
};


/**
 * Renders subset of Poke card data given by search string
 * 
 * @loc 8
 * @param {array} pokeData 
 */
function filterModalData(id, pokeData) {

    /*
    const text = document.getElementById("input-search").value.trim().toLowerCase();
    if (text.length < 3) {
        M.toast({ html: 'Please type at least 3 characters!' });
        return;
    }

    const subset = pokeData.filter(card => card.name.toLowerCase().includes(text));
    const subsetLength = subset.length;
    if (subsetLength == 0) M.toast({ html: 'No Pokèmons with that name found' });

    renderCards(subset);
    */
}