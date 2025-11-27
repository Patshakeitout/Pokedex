$(document).ready(() => {
    $('.modal').modal();

    // 1. Render 25 Semantic Cards
    const initGrid = () => {
        let h = ''; // 'h' for HTML string
        for (let i = 1; i <= 25; i++) {
            h += `<article class="card" data-id="${i}" data-t="Material Card ${i}" data-sub="Category ${i}"><hgroup><h3>Card ${i}</h3></hgroup><p>Tap to expand...</p></article>`;
        }
        $('#cardGrid').html(h);
    };

    // 2. Event Delegation: Open Modal
    $('#cardGrid').on('click', '.card', (e) => {
        const d = $(e.currentTarget).data(); // Get data attributes
        $('#modalTitle').text(d.t);
        $('#modalSubtitle').text(`ID: ${d.id} | ${d.sub}`);
        $('#modalBody').text(d.body);
        $('#cardModal').modal('open'); // Native Dialog API
    });

    // 3. Close Modal
    $('#modalCloseButton').on('click', () => $('#cardModal').modal('close'));

    initGrid();
});