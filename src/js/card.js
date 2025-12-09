/**
 * @file card.js
 * @fileoverview Script for card component.
 */

const POKE_PALETTE = {
    bug: { bg: '#A6B91A', info: '#444444' },
    dark: { bg: '#705746', info: '#444444' },
    dragon: { bg: '#6F35FC', info: '#444444' },
    electric: { bg: '#F7D02C', info: '#444444' },
    fairy: { bg: '#D685AD', info: '#444444' },
    fighting: { bg: '#C22E28', info: '#444444' },
    fire: { bg: '#EE8130', info: '#444444' },
    flying: { bg: '#A98FF3', info: '#444444' },
    ghost: { bg: '#735797', info: '#444444' },
    grass: { bg: '#7AC74C', info: '#444444' },
    ground: { bg: '#E2BF65', info: '#444444' },
    ice: { bg: '#96D9D6', info: '#444444' },
    normal: { bg: '#A8A77A', info: '#444444' },
    poison: { bg: '#A33EA1', info: '#444444' },
    psychic: { bg: '#F95587', info: '#444444' },
    rock: { bg: '#B6A136', info: '#444444' },
    steel: { bg: '#B7B7CE', info: '#444444' },
    water: { bg: '#6390F0', info: '#444444' }
};


/**
 * Generates a string of CSS Custom Properties (CSS variables) 
 * that define the thematic colors of a Pokémon card based on its type(s).
 * @function getCardStyleString
 * @loc 9
 * @param {string[]} types - An array of strings containing the Pokémon's type(s) (e.g., ['Grass', 'Poison']).
 * @returns {string} A string defining CSS Custom Properties (e.g., "--color-primary: #XXX; --color-secondary: #YYY;").
 */
const getCardStyleString = (types) => {
    const type1 = types[0];
    const type2 = types[1] || type1;
    const bgTypeColor1 = POKE_PALETTE[type1].bg || '#777';
    const bgTypeColor2 = POKE_PALETTE[type2].bg || color1;
    const infoColor = POKE_PALETTE[type1].info || '#E0E0E0';

    return `--color-primary: ${bgTypeColor1}; 
            --color-secondary: ${bgTypeColor2};
            --color-info: ${infoColor};
            `;
};


/**
 * Generates a CSS style string for a "pill" component (like a type label).
 * * It determines the background color and border color based on the provided 
 * Pokémon type name by querying the POKE_PALETTE constant.
 * @function getPillStyleString
 * @loc 5
 * @param {string} typeName - The name of the Pokémon type (e.g., 'Fire', 'Water').
 * @returns {string} A CSS string defining the background and border styles (e.g., "background-color: #XXX; border: 2px solid #YYY;").
 */
const getPillStyleString = (typeName) => {
    const pillColor = POKE_PALETTE[typeName].bg || '#777';
    const pillBorderColor = POKE_PALETTE[typeName].info || '#777';

    return `background-color: ${pillColor}; 
            border: 2px solid ${pillBorderColor};
            `;
};


/**
 * Generates the full HTML markup for a single Pokémon card component.
 * * It calculates the card's theme styles and individual type pill styles 
 * by calling helper functions (getCardStyleString, getPillStyleString) 
 * and handles a fallback for the back image if it's missing ("na").
 *
 * @function generateSingleCardHtml
 * @loc 9
 * @param {Object} card - The data object for a single Pokémon card.
 * @returns {string} The complete HTML markup for the <article class="card"> element.
 */
export const generateSingleCardHtml = (card) => {
    const cardStyle = getCardStyleString(card.types);

    const typePillsHtml = card.types.map(t => {
        const pillStyle = getPillStyleString(t);
        return `<li style="${pillStyle}">${t}</li>`;
    }).join("");

    if (card.imgBack == "na") {
        card.imgBack = card.img;
    }

    return `
    <article class="card" data-id="${card.id}" style="${cardStyle}">
        
        <hgroup class="card-title">
            <h3 class="name">${card.name}</h3>
            <h3 class="id">#${card.id}</h3>
        </hgroup>

        <figure class="poke-figure">
            <img src="${card.imgDefault}" alt="${card.name}" loading="lazy" class="front">
            <img src="${card.imgBack}" alt="${card.name}" loading="lazy" class="back">
        </figure>

        <footer class="stats">
            <ul class="types-vertical">
                ${typePillsHtml}
            </ul>
            <ul class="hw">
                <li>Height: ${card.height} cm</li>
                <li>Weight: ${card.weight} kg</li>
            </ul>
        </footer>

    </article>`;
}