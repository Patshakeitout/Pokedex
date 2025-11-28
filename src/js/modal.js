// modal.js

/**
 * @fileoverview modal js for handling overlay logic
 */

/**
 * Handles the click event on a card element within the grid.
 * * It extracts data attributes from the clicked card, populates the modal content,
 * * and then opens the Materialize modal.
 *
 * @param {Event} e - The jQuery click event object.
 * @returns {void}
 */
export const handleCardClick = (e) => {
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
export const handleModalClose = () => {
    $('#cardModal').modal('close');
};