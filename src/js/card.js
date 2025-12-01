// card.js

const POKE_PALETTE = {
    bug: { bg: '#A6B91A', info: '#444444' },
    dark: { bg: '#705746', info: '#E0E0E0' },
    dragon: { bg: '#6F35FC', info: '#E0E0E0' },
    electric: { bg: '#F7D02C', info: '#444444' },
    fairy: { bg: '#D685AD', info: '#444444' },
    fighting: { bg: '#C22E28', info: '#E0E0E0' },
    fire: { bg: '#EE8130', info: '#E0E0E0' },
    flying: { bg: '#A98FF3', info: '#444444' },
    ghost: { bg: '#735797', info: '#E0E0E0' },
    grass: { bg: '#7AC74C', info: '#E0E0E0' },
    ground: { bg: '#E2BF65', info: '#444444' },
    ice: { bg: '#96D9D6', info: '#444444' },
    normal: { bg: '#A8A77A', info: '#444444' },
    poison: { bg: '#A33EA1', info: '#E0E0E0' },
    psychic: { bg: '#F95587', info: '#E0E0E0' },
    rock: { bg: '#B6A136', info: '#E0E0E0' },
    steel: { bg: '#B7B7CE', info: '#444444' },
    water: { bg: '#6390F0', info: '#E0E0E0' }
};


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


const getPillStyleString = (typeName) => {
    const pillColor = POKE_PALETTE[typeName].bg || '#777';
    const pillBorderColor = POKE_PALETTE[typeName].info || '#777';
    
    // Text color (color) will be set in card.css
    return `background-color: ${pillColor}; 
            border: 1px solid ${pillBorderColor};
            `;
};


export const generateSingleCardHtml = (card) => {
    // 1. Calculate Card Background Styles immediately
    const cardStyle = getCardStyleString(card.types);

    // 2. Generate Pills HTML with their own inline styles
    const typePillsHtml = card.types.map(t => {
        const pillStyle = getPillStyleString(t);
        return `<li style="${pillStyle}">${t}</li>`;
    }).join("");

    // 3. Return the HTML string with styles embedded
    return `
    <article class="card" data-id="${card.id}" data-t="${card.name} ${card.id}" data-sub="Category ${card.id}" style="${cardStyle}">
        
        <hgroup class="card-title">
            <h3 class="name">${card.name}</h3>
            <h3 class="id">#${card.id}</h3>
        </hgroup>

        <figure class="poke-figure">
            <img src="${card.img}" alt="${card.name}" loading="lazy">
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