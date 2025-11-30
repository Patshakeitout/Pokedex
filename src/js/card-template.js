// cardTemplate.js

export const generateSingleCardHtml = (card) => {
    return `
    <article class="card" data-id="${card.id}" data-t="${card.name} ${card.id}" data-sub="Category ${card.id}">
        <hgroup class="card-title">
            <h3 class="name">${card.name}</h3>
            <h3 class="id">#${card.id}</h3>
        </hgroup>

        <figure class="poke-figure">
            <img src="${card.img}" alt="${card.name}" loading="lazy">
        </figure>

        <footer class="stats">
            <p class="hw">
                H: ${card.height}   W: ${card.weight}
            </p>
        </footer>   

    </article>`;
}