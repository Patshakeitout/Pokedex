/**
 * @file modal.js
 * @fileoverview Module for the overlay component (modals).
 */


/**
 * Build modal template.
 * @function
 * @loc 8
 * @param {Array} card - Card data.
 * @return {String} modalContent - Template string for modal content.
 */
const buildModalTemplate = (card) => {
    const abilityNames = card.abilities
        .map(a => a.ability.name)
        .join(", ");
    const moveNames = card.moves
        .map(a => a.move.name)
        .join(", ");
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
                    <div class="collapsible-header"><i class="material-icons">analytics</i>Stats</div>
                    <div class="collapsible-body">
                        <canvas id="statsChart" ></canvas>
                    </div>
                </li>
                <li>
                    <div class="collapsible-header"><i class="material-icons">sports_martial_arts</i>Moves</div>
                    <div class="collapsible-body"><span>${moveNames}</span></div>
                </li>
            </ul>

            <footer modal-footer>
                <a href="#!" id="prev" class="waves-effect waves-green btn-flat"><i class="material-icons">chevron_left</i></a>
                <a href="#!" id="next" class="waves-effect waves-green btn-flat"><i class="material-icons">chevron_right</i></a>
            </footer>
        </article>`;

    return modalContent;
}


/**
 * Renders the stats chart with shortLabel mapping.
 * @function
 * @loc 14
 * @param {Event} stats - Stats data.
 */
const renderStats = (stats) => {
    const shortLabel = name => ({
        hp: "HP",
        attack: "ATK",
        defense: "DEF",
        "special-attack": "SpA",
        "special-defense": "SpD",
        speed: "SPD"
    }[name] || name);

    const ctx = document.getElementById("statsChart");

    const fullLabels = stats.map(s => s.stat.name);
    const displayLabels = stats.map(s => shortLabel(s.stat.name));
    const values = stats.map(s => s.base_stat);

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: displayLabels,
            datasets: [{
                data: values,
                backgroundColor: "#E0E0E0",
                borderColor: "#E0E0E0",
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: function (tooltipItems) {
                            const index = tooltipItems[0].dataIndex;
                            return fullLabels[index].replace(/-/g, ' ').split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ');
                        },
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            return `Wert: ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: "#E0E0E0" },
                    grid: { color: "#E0E0E0" }
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: "#E0E0E0" },
                    grid: { color: "#E0E0E0" }
                }
            }
        }
    });
};


/**
 * Initializes the collapsible component (materialize).
 * @function initCollapsible
 * @loc 5
 * @param {String} - Template of modal.
 * 
 */
const initCollapsible = (modalContent) => {
    const modalElem = document.querySelector('#cardModal');
    const modal = M.Modal.getInstance(modalElem) || M.Modal.init(modalElem);
    modal.open();

    const list = modalContent.querySelector('.collapsible');
    const instance = M.Collapsible.init(list);
};


/**
 * Handles the click event on a card element within the grid.
 * * It extracts data attributes from the clicked card, populates the modal content,
 * * and then opens the Materialize modal.
 *
 * @function handleCardClick
 * @loc 13
 * @param {Event} event - The card click event object.
 * @param {Array} cards - The card array.
 */
export const handleCardClick = (event, cards) => {
    const cardTag = event.target.closest('.card');
    const id = parseInt(cardTag.dataset.id);
    const card = cards.find(item => item.id === id);

    const modalContent = buildModalTemplate(card);

    initCollapsible(modalContent);

    renderStats(card.stats);
};


/**
 * If you change the Modal with arrows this function is performed.
 ** Only para is dedicated card.
 * @function changeModal
 * @loc 3
 * @param {Array} card - The card array.
 */
export const changeModal = (card) => {
    const modalContent = buildModalTemplate(card);
    
    initCollapsible(modalContent);
    
    renderStats(card.stats);
};