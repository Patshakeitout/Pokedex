// cardTemplate.js
export const generateCardHtml = (id, name) => {
    return `
    <article class="card" data-id="${id}" data-t="${name} ${id}" data-sub="Category ${id}">
        <hgroup>
            <h3>${name} ${id}</h3>
        </hgroup>
        <p>Tap to expand...</p>
    </article>`;
}