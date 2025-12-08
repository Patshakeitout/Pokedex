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

    // Open Materialize modal
    const modalElem = document.querySelector('#cardModal');
    const modal = M.Modal.getInstance(modalElem) || M.Modal.init(modalElem);
    modal.open();

    // INIT collapsible **after** inserting new HTML
    const list = modalContent.querySelector('.collapsible');
    const instance = M.Collapsible.init(list);

    const renderStatsChart = stats => {
        const ctx = document.getElementById("statsChart");

        // Speichere die vollen Namen separat für die Tooltip-Anzeige
        const fullLabels = stats.map(s => s.stat.name);
        // Behalte die kurzen Labels für die Achsen-Beschriftung
        const displayLabels = stats.map(s => shortLabel(s.stat.name));
        const values = stats.map(s => s.base_stat);

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: displayLabels, // Die Achsenbeschriftung verwendet die kurzen Namen
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
                    // Hinzufügen der Tooltip-Konfiguration
                    tooltip: {
                        callbacks: {
                            // Diese Callback-Funktion steuert den Titel des Tooltips (den Label-Namen)
                            title: function (tooltipItems) {
                                // tooltipItems[0].dataIndex ist der Index des Elements im Array
                                const index = tooltipItems[0].dataIndex;
                                // Gib den vollständigen Namen aus dem 'fullLabels'-Array zurück
                                // Ersetze Bindestriche durch Leerzeichen und verwende Großbuchstaben am Anfang
                                return fullLabels[index].replace(/-/g, ' ').split(' ')
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(' ');
                            },
                            // Dieser Callback steuert den Inhalt der einzelnen Linien (Wert)
                            label: function (context) {
                                // Die Beschriftung bleibt der Wert (Base Stat)
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                // Formatiert den Wert, z.B. "Wert: 100"
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


    const shortLabel = name => ({
        hp: "HP",
        attack: "ATK",
        defense: "DEF",
        "special-attack": "SpA",
        "special-defense": "SpD",
        speed: "SPD"
    }[name] || name);

    renderStatsChart(card.stats);
};


export const changeModal = (card) => {
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

    // Open Materialize modal
    const modalElem = document.querySelector('#cardModal');
    const modal = M.Modal.getInstance(modalElem) || M.Modal.init(modalElem);
    modal.open();

    // INIT collapsible **after** inserting new HTML
    const list = modalContent.querySelector('.collapsible');
    const instance = M.Collapsible.init(list);

    const renderStatsChart = stats => {
        const ctx = document.getElementById("statsChart");

        // Speichere die vollen Namen separat für die Tooltip-Anzeige
        const fullLabels = stats.map(s => s.stat.name);
        // Behalte die kurzen Labels für die Achsen-Beschriftung
        const displayLabels = stats.map(s => shortLabel(s.stat.name));
        const values = stats.map(s => s.base_stat);

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: displayLabels, // Die Achsenbeschriftung verwendet die kurzen Namen
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
                    // Hinzufügen der Tooltip-Konfiguration
                    tooltip: {
                        callbacks: {
                            // Diese Callback-Funktion steuert den Titel des Tooltips (den Label-Namen)
                            title: function (tooltipItems) {
                                // tooltipItems[0].dataIndex ist der Index des Elements im Array
                                const index = tooltipItems[0].dataIndex;
                                // Gib den vollständigen Namen aus dem 'fullLabels'-Array zurück
                                // Ersetze Bindestriche durch Leerzeichen und verwende Großbuchstaben am Anfang
                                return fullLabels[index].replace(/-/g, ' ').split(' ')
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(' ');
                            },
                            // Dieser Callback steuert den Inhalt der einzelnen Linien (Wert)
                            label: function (context) {
                                // Die Beschriftung bleibt der Wert (Base Stat)
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                // Formatiert den Wert, z.B. "Wert: 100"
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


    const shortLabel = name => ({
        hp: "HP",
        attack: "ATK",
        defense: "DEF",
        "special-attack": "SpA",
        "special-defense": "SpD",
        speed: "SPD"
    }[name] || name);

    renderStatsChart(card.stats);
};