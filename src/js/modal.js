/**
 * @file modal.js
 * @fileoverview Module for the overlay component (modals).
 */


/**
 * Return modal template.
 * @function
 * @param {Array} card Card data.
 * @return {Array} abilityNames  
 */
const renderModalTemplate = (card, abilityNames) => {
    return `
        <article class="modal-content">
            <hgroup>
                <h4>${card.name}</h4>
                <h4 id="card-id">#${card.id}</h4>
            </hgroup>
            <figure>
                <img id="img-poke" src="${card.img}" alt="${card.name}">
            </figure>

            <section class="modal-tabs row">
                <div class="col s12 z-depth-0 transparent"> 
                    <ul class="tabs">
                        <li class="tab tabs-transparent col s3"><a href="#about">About</a></li>
                        <li class="tab tabs-transparent col s3"><a class="active" href="#stats">Stats</a></li>
                    </ul>
                </div>

                <article id="about" class="card-abilities col s12">
                    <dl>
                        <dt>Abilities:</dt><dd>${abilityNames}</dd> 
                    </dl>
                    <dl>
                        <dt>Height:</dt><dd>${card.height} cm</dd> 
                    </dl>
                    <dl>
                        <dt>Weight:</dt><dd>${card.weight} kg</dd> 
                    </dl>
                </article>
                <article id="stats" class="col s12"><canvas id="statsChart" ></canvas></article>
            </section>

            <footer modal-footer>
                <a href="#!" id="prev" class="waves-effect waves-green btn-flat"><i class="material-icons">chevron_left</i></a>
                <a href="#!" id="next" class="waves-effect waves-green btn-flat"><i class="material-icons">chevron_right</i></a>
            </footer>
        </article>`;
}


/**
 * Build modal template.
 * @function
 * @loc 13
 * @param {Array} card - Card data.
 * @return {String} modalContent - Template string for modal content.
 */
const buildModalTemplate = (card, prevHide = false, nextHide = false) => {
    const abilityNames = card.abilities
        .map(a => a.ability.name)
        .join(", ");
    const moveNames = card.moves
        .map(a => a.move.name)
        .join(", ");
    const modalContent = document.querySelector('.modal');

    modalContent.innerHTML = renderModalTemplate(card, abilityNames);

    const prevBtn = modalContent.querySelector('#prev');
    const nextBtn = modalContent.querySelector('#next');

    if (prevHide) prevBtn.style.visibility = 'hidden';
    if (nextHide) nextBtn.style.visibility = 'hidden';

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
 * Initializes the tabs component (Materialize).
 * @function initTabs
 * @loc 4
 * @param {HTMLElement} rootElem - The parent element containing the tabs markup.
 */
const initTabs = (rootElem) => {
    const modalElem = document.querySelector('#cardModal');
    const modal = M.Modal.getInstance(modalElem) || M.Modal.init(modalElem);
    modal.open();

    const tabsElem = rootElem.querySelector('.tabs');
    M.Tabs.init(tabsElem);
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
export const handleCardClick = (event, cards, cardsSearch) => {
    const cardTag = event.target.closest('.card');
    const id = parseInt(cardTag.dataset.id);
    const card = cards.find(item => item.id === id);
    let modalContent = '';

    if (cardsSearch.length == 1) {
        modalContent = buildModalTemplate(card, true, true);
    } else if (card == cards[cards.length - 1] || card == cardsSearch[cardsSearch.length - 1]) {
        modalContent = buildModalTemplate(card, false, true);
    } else if (card == cards[0] || card == cardsSearch[0]) {
        modalContent = buildModalTemplate(card, true, false);
    } else {
        modalContent = buildModalTemplate(card, false, false);
    }

    initTabs(modalContent);
   
    renderStats(card.stats);
};


/**
 * If you change the Modal with arrows this function is performed.
 ** Only para is dedicated card.
 * @function changeModal
 * @loc 3
 * @param {Array} card - The card array.
 */
export const changeModal = (card, cards, cardsSearch) => {
    let modalContent = '';

    if (card == cards[0] || card == cardsSearch[0]) {
        modalContent = buildModalTemplate(card, true, false);
    } else if (card == cards[cards.length - 1] || card == cardsSearch[cardsSearch.length - 1]) {
        modalContent = buildModalTemplate(card, false, true);
    } else {
        modalContent = buildModalTemplate(card, false, false);
    }

    initTabs(modalContent);

    renderStats(card.stats);
};