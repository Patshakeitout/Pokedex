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
    const cardTag = event.target.closest('.card');
    const id = parseInt(cardTag.dataset.id);
    const card = cards.find(item => item.id === id);
    const abilityNames = card.abilities
        .map(a => a.ability.name)
        .join(", ");
    const moveNames = card.moves
        .map(a => a.move.name)
        .join(", ");    
    console.log(card);
    const modalContent = document.querySelector('.modal');

    modalContent.innerHTML = `
        <article class="modal-content">
            <hgroup>
                <h4>${card.name}</h4>
                <h4 id="card-id">#${card.id}</h4>
            </hgroup>
            <figure>
                <img id="img-poke" src="${card.img}" alt="${card.name}">
            </figure>
            
            <section class="card-abilities">
                <dl>
                    <dt>Abilities:</dt>
                    <dd>${abilityNames}</dd>
                </dl>
            </section>

            <ul class="collapsible">
                <li>
                    <div class="collapsible-header"><i class="material-icons">filter_drama</i>Moves</div>
                    <div class="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
                </li>
                <li class="active">
                    <div class="collapsible-header"><i class="material-icons">place</i>Stats</div>
                    <div class="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
                </li>
            </ul>

            <footer class="modal-footer">
                <a href="#!" id="prev" class="waves-effect waves-green btn-flat">Previous</a>
                <a href="#!" id="next" class="waves-effect waves-green btn-flat">Next</a>
            </footer>
        </article>`;

    // Open Materialize modal
    const modalElem = document.querySelector('#cardModal');
    const modal = M.Modal.getInstance(modalElem) || M.Modal.init(modalElem);
    modal.open();
};


export const changeModal = (card) => {
    console.log(card);

    const modalContent = document.querySelector('.modal');
    modalContent.innerHTML = '';
    // modalContent.innerHTML = `
    //     <article class="modal-content">
    //         <hgroup>
    //             <h2>${card.name}sdsd</h2>
    //             <h2>${card.name}sdsd</h2>
    //             <h2 id="card-id">#${card.name}</h2>/ 
    //         </hgroup>
    //         <p id="modalBody">
    //         <figure>
    //             <img id="img-poke" src="${card.img}" alt="${card.name}">
    //         </figure>
    //         <footer class="modal-footer">
    //             <a href="#!" id="prev" class="waves-effect waves-green btn-flat">Previous</a>
    //             <a href="#!" id="next" class="waves-effect waves-green btn-flat">Next</a>
    //         </footer>
    //     </article>`;
};