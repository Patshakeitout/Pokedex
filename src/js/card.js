// card.js

const TYPE_COLORS = {
    normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
    grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
    ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
    rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
    steel: '#B7B7CE', fairy: '#D685AD'
};


const getCardStyleString = (types) => {
    const type1 = types[0];
    const type2 = types[1] || type1;
    const color1 = TYPE_COLORS[type1] || '#777';
    const color2 = TYPE_COLORS[type2] || color1;

    return `--color-primary: ${color1}; --color-secondary: ${color2};`;
};


const getPillStyleString = (typeName) => {
    const color = TYPE_COLORS[typeName] || '#777';

    return `background-color: ${color};`;
};


export const generateSingleCardHtml = (card) => {
    // 1. Calculate Card Background Styles immediately
    const cardStyle = getCardStyleString(card.types);

    // 2. Generate Pills HTML with their own inline styles
    const typePillsHtml = card.types.map(t => {
        const pillStyle = getPillStyleString(t.toLowerCase());
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