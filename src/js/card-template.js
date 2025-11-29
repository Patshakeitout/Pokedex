// cardTemplate.js

export const generateSingleCardHtml = (card) => {
    return `
    <article class="card" data-id="${card.id}" data-t="${card.name} ${card.id}" data-sub="Category ${card.id}">
        <hgroup>
            <h3>${card.name} ${card.id}</h3>
        </hgroup>
        <p>Tap to expand...</p>
    </article>`;
}