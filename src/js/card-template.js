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
            <ul class="types-vertical">
                ${card.types.map(t => `<li>${t}</li>`).join("")}
            </ul>

            <ul class="hw">
                <li>Height: ${card.height} cm</li>
                <li>Weight: ${card.weight} kg</li>
            </ul>
        </footer>

    </article>`;
}